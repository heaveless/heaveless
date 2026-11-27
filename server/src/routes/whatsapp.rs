use std::sync::OnceLock;

use axum::body::Bytes;
use axum::extract::{Query, State};
use axum::http::{header, HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use axum::Json;
use hmac::{Hmac, Mac};
use reqwest::Client;
use serde::Deserialize;
use serde_json::{json, Value};
use sha2::Sha256;

use super::AppState;

const SIGNATURE_PREFIX: &str = "sha256=";

fn http() -> &'static Client {
    static CLIENT: OnceLock<Client> = OnceLock::new();
    CLIENT.get_or_init(Client::new)
}

#[derive(Deserialize)]
pub struct ChallengeQuery {
    #[serde(rename = "hub.mode")]
    mode: Option<String>,
    #[serde(rename = "hub.verify_token")]
    verify_token: Option<String>,
    #[serde(rename = "hub.challenge")]
    challenge: Option<String>,
}

/// GET /api/whatsapp/webhook
///
/// Handshake Meta runs once when the callback URL is registered: it must be
/// answered with the raw `hub.challenge` value and nothing else.
pub async fn verify(State(state): State<AppState>, Query(query): Query<ChallengeQuery>) -> Response {
    let Some(expected) = state.config.whatsapp.verify_token.as_deref() else {
        tracing::warn!("whatsapp webhook called but WHATSAPP_VERIFY_TOKEN is not set");
        return StatusCode::SERVICE_UNAVAILABLE.into_response();
    };

    let subscribed = query.mode.as_deref() == Some("subscribe");
    let token_matches = query
        .verify_token
        .as_deref()
        .is_some_and(|token| constant_time_eq(token, expected));

    if subscribed && token_matches {
        tracing::info!("whatsapp webhook verified");
        return (StatusCode::OK, query.challenge.unwrap_or_default()).into_response();
    }

    tracing::warn!(mode = ?query.mode, "whatsapp webhook verification failed");
    StatusCode::FORBIDDEN.into_response()
}

/// POST /api/whatsapp/webhook
///
/// Receives message and status events. Meta only needs a fast 2xx, so payloads
/// are logged rather than processed inline; anything slow belongs in a job.
pub async fn receive(State(state): State<AppState>, headers: HeaderMap, body: Bytes) -> Response {
    if let Some(secret) = state.config.whatsapp.app_secret.as_deref() {
        let signature = headers
            .get("x-hub-signature-256")
            .and_then(|value| value.to_str().ok());

        if !signature_matches(secret, &body, signature) {
            tracing::warn!("whatsapp webhook signature mismatch");
            return StatusCode::UNAUTHORIZED.into_response();
        }
    }

    let payload: Value = match serde_json::from_slice(&body) {
        Ok(payload) => payload,
        Err(error) => {
            tracing::warn!(%error, "whatsapp webhook body is not JSON");
            return StatusCode::BAD_REQUEST.into_response();
        }
    };

    log_events(&payload);
    (StatusCode::OK, "EVENT_RECEIVED").into_response()
}

/// POST /api/whatsapp/send
///
/// Sends a text or template message through the Cloud API. Callers authorise
/// with `Authorization: Bearer $WHATSAPP_SEND_SECRET`, so the endpoint stays
/// closed even though the API itself is public.
pub async fn send(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(request): Json<SendRequest>,
) -> Response {
    let config = &state.config.whatsapp;

    let Some(secret) = config.send_secret.as_deref() else {
        tracing::warn!("whatsapp send called but WHATSAPP_SEND_SECRET is not set");
        return StatusCode::SERVICE_UNAVAILABLE.into_response();
    };

    let authorized = headers
        .get(header::AUTHORIZATION)
        .and_then(|value| value.to_str().ok())
        .and_then(|value| value.strip_prefix("Bearer "))
        .is_some_and(|token| constant_time_eq(token.trim(), secret));

    if !authorized {
        tracing::warn!("whatsapp send rejected: bad or missing bearer token");
        return StatusCode::UNAUTHORIZED.into_response();
    }

    let (Some(access_token), Some(phone_number_id)) =
        (config.access_token.as_deref(), config.phone_number_id.as_deref())
    else {
        tracing::warn!("whatsapp send called without WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID");
        return StatusCode::SERVICE_UNAVAILABLE.into_response();
    };

    let payload = request.payload();
    let url = format!(
        "https://graph.facebook.com/{}/{phone_number_id}/messages",
        config.graph_version
    );

    match http()
        .post(url)
        .bearer_auth(access_token)
        .json(&payload)
        .send()
        .await
    {
        Ok(response) => {
            let status = response.status();
            let body: Value = response
                .json()
                .await
                .unwrap_or_else(|_| json!({ "error": "graph returned a non-JSON body" }));

            if status.is_success() {
                tracing::info!(status = status.as_u16(), "whatsapp message accepted");
                (StatusCode::OK, Json(body)).into_response()
            } else {
                tracing::warn!(status = status.as_u16(), %body, "whatsapp send rejected");
                (StatusCode::BAD_GATEWAY, Json(body)).into_response()
            }
        }
        Err(error) => {
            tracing::error!(%error, "whatsapp send request failed");
            (
                StatusCode::BAD_GATEWAY,
                Json(json!({ "error": "graph request failed" })),
            )
                .into_response()
        }
    }
}

#[derive(Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum SendRequest {
    Text {
        to: String,
        body: String,
        #[serde(default)]
        preview_url: bool,
    },
    Template {
        to: String,
        name: String,
        #[serde(default = "default_language")]
        language: String,
        #[serde(default)]
        components: Option<Value>,
    },
}

fn default_language() -> String {
    "es".to_string()
}

impl SendRequest {
    fn payload(&self) -> Value {
        match self {
            SendRequest::Text {
                to,
                body,
                preview_url,
            } => json!({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": to,
                "type": "text",
                "text": { "preview_url": preview_url, "body": body },
            }),
            SendRequest::Template {
                to,
                name,
                language,
                components,
            } => {
                let mut template = json!({
                    "name": name,
                    "language": { "code": language },
                });

                if let Some(components) = components {
                    template["components"] = components.clone();
                }

                json!({
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": to,
                    "type": "template",
                    "template": template,
                })
            }
        }
    }
}

fn log_events(payload: &Value) {
    let Some(entries) = payload.get("entry").and_then(Value::as_array) else {
        return;
    };

    for entry in entries {
        let account = entry.get("id").and_then(Value::as_str);

        let Some(changes) = entry.get("changes").and_then(Value::as_array) else {
            continue;
        };

        for change in changes {
            let field = change.get("field").and_then(Value::as_str);
            let value = change.get("value").cloned().unwrap_or(Value::Null);

            if let Some(messages) = value.get("messages").and_then(Value::as_array) {
                for message in messages {
                    let from = message.get("from").and_then(Value::as_str);
                    let kind = message.get("type").and_then(Value::as_str);
                    let message_id = message.get("id").and_then(Value::as_str);
                    let text = message
                        .get("text")
                        .and_then(|text| text.get("body"))
                        .and_then(Value::as_str);

                    tracing::info!(
                        account,
                        field,
                        from,
                        kind,
                        message_id,
                        text,
                        "whatsapp inbound message"
                    );
                }
            }

            if let Some(statuses) = value.get("statuses").and_then(Value::as_array) {
                for status in statuses {
                    let state = status.get("status").and_then(Value::as_str);
                    let message_id = status.get("id").and_then(Value::as_str);
                    let recipient = status.get("recipient_id").and_then(Value::as_str);

                    tracing::info!(
                        account,
                        field,
                        state,
                        message_id,
                        recipient,
                        "whatsapp message status"
                    );
                }
            }
        }
    }
}

fn signature_matches(secret: &str, body: &[u8], header: Option<&str>) -> bool {
    let Some(header) = header else {
        return false;
    };

    let Some(digest) = header.strip_prefix(SIGNATURE_PREFIX) else {
        return false;
    };

    let Ok(expected) = hex::decode(digest) else {
        return false;
    };

    let Ok(mut mac) = Hmac::<Sha256>::new_from_slice(secret.as_bytes()) else {
        return false;
    };

    mac.update(body);
    mac.verify_slice(&expected).is_ok()
}

fn constant_time_eq(candidate: &str, expected: &str) -> bool {
    let (candidate, expected) = (candidate.as_bytes(), expected.as_bytes());

    if candidate.len() != expected.len() {
        return false;
    }

    let mut difference = 0u8;

    for (left, right) in candidate.iter().zip(expected.iter()) {
        difference |= left ^ right;
    }

    difference == 0
}

#[cfg(test)]
mod tests {
    use super::{constant_time_eq, SendRequest};
    use serde_json::json;

    #[test]
    fn constant_time_eq_matches_equal_values() {
        assert!(constant_time_eq("token", "token"));
    }

    #[test]
    fn constant_time_eq_rejects_different_values() {
        assert!(!constant_time_eq("token", "tokeN"));
        assert!(!constant_time_eq("token", "token-longer"));
    }

    #[test]
    fn text_payload_matches_the_cloud_api_shape() {
        let request = SendRequest::Text {
            to: "15551234567".to_string(),
            body: "hola".to_string(),
            preview_url: false,
        };

        assert_eq!(
            request.payload(),
            json!({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": "15551234567",
                "type": "text",
                "text": { "preview_url": false, "body": "hola" },
            })
        );
    }

    #[test]
    fn template_payload_includes_language_and_skips_empty_components() {
        let request: SendRequest = serde_json::from_value(json!({
            "type": "template",
            "to": "15551234567",
            "name": "hello_world",
        }))
        .expect("template request should deserialize");

        assert_eq!(
            request.payload(),
            json!({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": "15551234567",
                "type": "template",
                "template": { "name": "hello_world", "language": { "code": "es" } },
            })
        );
    }
}
