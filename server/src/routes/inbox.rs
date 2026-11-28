use axum::extract::{Query, State};
use axum::http::StatusCode;
use axum::response::{Html, IntoResponse, Redirect, Response};
use axum::Form;
use serde::Deserialize;

use super::whatsapp::{constant_time_eq, deliver, recent_messages, SendRequest};
use super::AppState;

#[derive(Deserialize)]
pub struct PageQuery {
    token: Option<String>,
    to: Option<String>,
}

#[derive(Deserialize)]
pub struct SendForm {
    token: String,
    to: String,
    body: String,
}

/// GET /admin/whatsapp?token=…
///
/// A deliberately small inbox: the last messages plus a box to reply. Reads are
/// gated by `WHATSAPP_ADMIN_TOKEN` because it exposes customer conversations.
pub async fn page(State(state): State<AppState>, Query(query): Query<PageQuery>) -> Response {
    let Some(expected) = state.config.whatsapp.admin_token.as_deref() else {
        return (StatusCode::SERVICE_UNAVAILABLE, "inbox is not configured").into_response();
    };

    if !query
        .token
        .as_deref()
        .is_some_and(|token| constant_time_eq(token, expected))
    {
        return StatusCode::UNAUTHORIZED.into_response();
    }

    let messages = recent_messages(&state.pool, 100).await;
    Html(render(&messages, expected, query.to.as_deref())).into_response()
}

/// POST /admin/whatsapp/send
pub async fn send(State(state): State<AppState>, Form(form): Form<SendForm>) -> Response {
    let Some(expected) = state.config.whatsapp.admin_token.as_deref() else {
        return (StatusCode::SERVICE_UNAVAILABLE, "inbox is not configured").into_response();
    };

    if !constant_time_eq(&form.token, expected) {
        return StatusCode::UNAUTHORIZED.into_response();
    }

    let request = SendRequest::Text {
        to: form.to.trim().to_string(),
        body: form.body,
        preview_url: false,
    };

    match deliver(&state, &request).await {
        Ok(_) => Redirect::to(&format!("/admin/whatsapp?token={}", urlencode(expected))).into_response(),
        Err((status, body)) => (
            status,
            Html(format!(
                "<p>No se pudo enviar: <code>{}</code></p><p><a href=\"/admin/whatsapp?token={}\">volver</a></p>",
                escape(&body.to_string()),
                escape(expected)
            )),
        )
            .into_response(),
    }
}

fn urlencode(value: &str) -> String {
    value
        .chars()
        .map(|character| match character {
            'a'..='z' | 'A'..='Z' | '0'..='9' | '-' | '_' | '.' | '~' => character.to_string(),
            other => format!("%{:02X}", other as u32 & 0xff),
        })
        .collect()
}

fn escape(value: &str) -> String {
    value
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
}

fn render(messages: &[super::whatsapp::MessageRecord], token: &str, to: Option<&str>) -> String {
    let token = escape(token);
    let default_to = to
        .map(escape)
        .or_else(|| {
            messages
                .iter()
                .find(|message| message.direction == "in")
                .map(|message| escape(&message.phone))
        })
        .unwrap_or_default();

    let rows = messages
        .iter()
        .map(|message| {
            let (arrow, colour) = if message.direction == "in" {
                ("←", "#2f6f4f")
            } else {
                ("→", "#3b4f8f")
            };

            let text = message.body.clone().unwrap_or_else(|| format!("[{}]", message.kind));

            format!(
                "<tr><td class=\"when\">{}</td><td class=\"dir\" style=\"color:{colour}\">{arrow}</td>\
                 <td class=\"phone\">{}</td><td class=\"body\">{}</td><td class=\"status\">{}</td></tr>",
                message.created_at.format("%d/%m %H:%M"),
                escape(&message.phone),
                escape(&text),
                escape(message.status.as_deref().unwrap_or("")),
            )
        })
        .collect::<String>();

    format!(
        r#"<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="20">
<title>heaveless · whatsapp</title>
<style>
  :root {{ color-scheme: light dark; }}
  body {{ margin: 0; padding: 32px 20px 64px; font: 15px/1.5 ui-sans-serif, system-ui, sans-serif;
         background: #f6f5f2; color: #17171a; }}
  h1 {{ font-size: 20px; margin: 0 0 4px; letter-spacing: -0.01em; }}
  p.hint {{ margin: 0 0 24px; color: #6b6b73; font-size: 13px; }}
  form {{ display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }}
  input, textarea {{ font: inherit; padding: 10px 12px; border: 1px solid #d5d3cd;
                     border-radius: 8px; background: #fff; }}
  input[name=to] {{ width: 190px; }}
  textarea {{ flex: 1 1 320px; min-height: 44px; resize: vertical; }}
  button {{ font: inherit; padding: 10px 18px; border: 0; border-radius: 8px;
            background: #17171a; color: #fff; cursor: pointer; }}
  table {{ width: 100%; border-collapse: collapse; background: #fff;
           border-radius: 10px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,.06); }}
  th, td {{ text-align: left; padding: 10px 12px; border-bottom: 1px solid #ecebe7;
            vertical-align: top; }}
  th {{ font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: #6b6b73; }}
  td.when, td.status {{ white-space: nowrap; color: #6b6b73; font-size: 13px; }}
  td.dir {{ font-size: 16px; }}
  td.phone {{ white-space: nowrap; font-variant-numeric: tabular-nums; }}
  tr:last-child td {{ border-bottom: 0; }}
</style>
</head>
<body>
<h1>heaveless · whatsapp</h1>
<p class="hint">Últimos 100 mensajes. La página se refresca sola cada 20 s.</p>
<form method="post" action="/admin/whatsapp/send">
  <input type="hidden" name="token" value="{token}">
  <input name="to" value="{default_to}" placeholder="51972351040" required>
  <textarea name="body" placeholder="Escribe una respuesta…" required></textarea>
  <button type="submit">Enviar</button>
</form>
<table>
<thead><tr><th>Cuándo</th><th></th><th>Número</th><th>Mensaje</th><th>Estado</th></tr></thead>
<tbody>{rows}</tbody>
</table>
</body>
</html>"#
    )
}
