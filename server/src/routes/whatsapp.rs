use axum::body::Bytes;
use axum::extract::{Query, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use hmac::{Hmac, Mac};
use serde::Deserialize;
use serde_json::Value;
use sha2::Sha256;

use super::AppState;

const SIGNATURE_PREFIX: &str = "sha256=";

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
    use super::constant_time_eq;

    #[test]
    fn constant_time_eq_matches_equal_values() {
        assert!(constant_time_eq("token", "token"));
    }

    #[test]
    fn constant_time_eq_rejects_different_values() {
        assert!(!constant_time_eq("token", "tokeN"));
        assert!(!constant_time_eq("token", "token-longer"));
    }
}
