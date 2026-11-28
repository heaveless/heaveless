use std::collections::HashMap;

use axum::extract::{Query, State};
use axum::http::StatusCode;
use axum::response::{Html, IntoResponse, Redirect, Response};
use axum::Form;
use chrono::{DateTime, Local, Utc};
use serde::Deserialize;

use super::whatsapp::{constant_time_eq, deliver, recent_messages, MessageRecord, SendRequest};
use super::AppState;

#[derive(Deserialize)]
pub struct PageQuery {
    token: Option<String>,
    phone: Option<String>,
}

#[derive(Deserialize)]
pub struct SendForm {
    token: String,
    to: String,
    body: String,
}

/// GET /api/admin/whatsapp?token=…
///
/// A small inbox: conversations on the left, the selected thread and a composer
/// on the right. Reads are gated by `WHATSAPP_ADMIN_TOKEN` because it exposes
/// customer conversations.
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

    let messages = recent_messages(&state.pool, 400).await;
    let selected = query
        .phone
        .clone()
        .or_else(|| messages.first().map(|message| message.phone.clone()));

    Html(render(&messages, expected, selected.as_deref())).into_response()
}

/// POST /api/admin/whatsapp/send
pub async fn send(State(state): State<AppState>, Form(form): Form<SendForm>) -> Response {
    let Some(expected) = state.config.whatsapp.admin_token.as_deref() else {
        return (StatusCode::SERVICE_UNAVAILABLE, "inbox is not configured").into_response();
    };

    if !constant_time_eq(&form.token, expected) {
        return StatusCode::UNAUTHORIZED.into_response();
    }

    let to = form.to.trim().to_string();
    let request = SendRequest::Text {
        to: to.clone(),
        body: form.body,
        preview_url: false,
    };

    let back = format!("/api/admin/whatsapp?token={}&phone={}", urlencode(expected), urlencode(&to));

    match deliver(&state, &request).await {
        Ok(_) => Redirect::to(&back).into_response(),
        Err((status, body)) => (
            status,
            Html(error_page(status.as_u16(), &body.to_string(), &back)),
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
        .replace('\'', "&#39;")
}

fn truncate(value: &str, limit: usize) -> String {
    let mut characters = value.chars();
    let short: String = characters.by_ref().take(limit).collect();
    if characters.next().is_some() {
        format!("{short}…")
    } else {
        short
    }
}

fn clock(value: DateTime<Utc>) -> String {
    let local: DateTime<Local> = value.with_timezone(&Local);
    if local.date_naive() == Local::now().date_naive() {
        local.format("%H:%M").to_string()
    } else {
        local.format("%d %b").to_string()
    }
}

fn status_label(status: &str) -> &'static str {
    match status {
        "accepted" | "sent" => "enviado",
        "delivered" => "entregado",
        "read" => "leído",
        "failed" => "falló",
        _ => "",
    }
}

fn shell(title: &str, body: &str) -> String {    format!(
        r#"<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>
  :root {{
    --night: #11110f;
    --surface: #191916;
    --surface-2: #1f1f1b;
    --ink: #f5f2ec;
    --muted: rgba(245, 242, 236, .58);
    --line: rgba(245, 242, 236, .15);
    --coral: #ff5666;
    --sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Arial, sans-serif;
    --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  }}
  * {{ box-sizing: border-box; }}
  html {{ color-scheme: dark; }}
  body {{
    margin: 0; min-height: 100dvh; background: var(--night); color: var(--ink);
    font-family: var(--sans); font-size: 15px; line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }}
  a {{ color: inherit; }}
  .label {{
    font-family: var(--mono); font-size: 10px; letter-spacing: .14em;
    text-transform: uppercase; color: var(--muted);
  }}
  header {{
    display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap;
    padding: 26px 28px 22px; border-bottom: 1px solid var(--line);
  }}
  header h1 {{
    margin: 0; font-size: 19px; font-weight: 600; letter-spacing: -.03em;
  }}
  header .dot {{
    width: 6px; height: 6px; border-radius: 50%; background: var(--coral);
    display: inline-block; margin-right: 7px; vertical-align: middle;
  }}
  main {{
    display: grid; grid-template-columns: 296px minmax(0, 1fr);
    gap: 0; min-height: calc(100dvh - 74px);
  }}
  .threads {{ border-right: 1px solid var(--line); padding: 14px 10px 24px; }}
  .threads > .label {{ padding: 0 12px 10px; display: block; }}
  .thread {{
    display: block; padding: 12px 14px; border-radius: 10px; text-decoration: none;
    border: 1px solid transparent;
  }}
  .thread:hover {{ background: var(--surface); }}
  .thread[aria-current="true"] {{ background: var(--surface); border-color: var(--line); }}
  .thread .who {{ font-weight: 550; font-variant-numeric: tabular-nums; }}
  .thread .preview {{
    display: block; margin-top: 3px; color: var(--muted); font-size: 13px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }}
  .thread .when {{ float: right; color: var(--muted); font-family: var(--mono); font-size: 10px; }}
  .panel {{ display: flex; flex-direction: column; min-width: 0; }}
  .panel-head {{
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 16px 26px; border-bottom: 1px solid var(--line);
  }}
  .panel-head strong {{ font-variant-numeric: tabular-nums; letter-spacing: -.01em; }}
  .messages {{
    flex: 1; overflow-y: auto; padding: 24px 26px 8px;
    display: flex; flex-direction: column; gap: 10px;
  }}
  .bubble {{
    max-width: min(560px, 82%); padding: 11px 14px; border-radius: 14px;
    border: 1px solid var(--line); background: var(--surface);
    white-space: pre-wrap; overflow-wrap: anywhere;
  }}
  .bubble.out {{
    align-self: flex-end; background: #2a1418; border-color: rgba(255, 86, 102, .27);
  }}
  .bubble .meta {{
    display: flex; gap: 8px; align-items: center; margin-top: 6px;
    font-family: var(--mono); font-size: 10px; letter-spacing: .1em;
    text-transform: uppercase; color: var(--muted);
  }}
  .bubble.out .meta {{ justify-content: flex-end; }}
  .composer {{
    display: flex; gap: 10px; align-items: flex-end; padding: 16px 26px 24px;
    border-top: 1px solid var(--line);
  }}
  .composer textarea {{
    flex: 1; min-height: 46px; max-height: 180px; resize: vertical;
    padding: 12px 14px; border-radius: 12px; border: 1px solid var(--line);
    background: var(--surface); color: var(--ink); font: inherit;
  }}
  .composer textarea::placeholder {{ color: var(--muted); }}
  .composer button {{
    padding: 12px 22px; border: 0; border-radius: 999px; cursor: pointer;
    background: var(--coral); color: #16100f; font: inherit; font-weight: 600;
  }}
  .composer button:hover {{ filter: brightness(1.06); }}
  textarea:focus-visible, button:focus-visible, .thread:focus-visible {{
    outline: 2px solid var(--coral); outline-offset: 2px;
  }}
  .empty {{
    margin: auto; padding: 40px; text-align: center; color: var(--muted); max-width: 42ch;
  }}
  .empty strong {{ display: block; color: var(--ink); margin-bottom: 6px; font-weight: 550; }}
  @media (max-width: 820px) {{
    main {{ grid-template-columns: 1fr; }}
    .threads {{ border-right: 0; border-bottom: 1px solid var(--line); }}
    .threads .thread {{ padding: 10px 12px; }}
  }}
</style>
</head>
<body>
{body}
</body>
</html>"#
    )
}

fn error_page(status: u16, detail: &str, back: &str) -> String {
    shell(
        "heaveless · whatsapp",
        &format!(
            r#"<header><h1>heaveless</h1><span class="label">whatsapp inbox</span></header>
<main><div class="panel"><div class="empty">
<strong>No se pudo enviar ({status})</strong>
<p class="label" style="margin:0 0 16px">{}</p>
<a class="label" href="{}">volver a la bandeja</a>
</div></div></main>"#,
            escape(&truncate(detail, 240)),
            escape(back)
        ),
    )
}

fn render(messages: &[MessageRecord], token: &str, selected: Option<&str>) -> String {
    let token_html = escape(token);

    if messages.is_empty() {
        return shell(
            "heaveless · whatsapp",
            r#"<header><h1>heaveless</h1><span class="label">whatsapp inbox</span></header>
<main><div class="panel"><div class="empty">
<strong>Todavía no hay mensajes</strong>
Cuando alguien escriba al número de WhatsApp del negocio, la conversación aparece aquí.
</div></div></main>"#,
        );
    }

    // Group by phone, newest conversation first.
    let mut order: Vec<String> = Vec::new();
    let mut threads: HashMap<String, Vec<&MessageRecord>> = HashMap::new();

    for message in messages {
        if !threads.contains_key(&message.phone) {
            order.push(message.phone.clone());
        }
        threads.entry(message.phone.clone()).or_default().push(message);
    }

    let current = selected
        .filter(|phone| threads.contains_key(*phone))
        .map(str::to_string)
        .unwrap_or_else(|| order[0].clone());

    let thread_rows = order
        .iter()
        .map(|phone| {
            let entries = &threads[phone];
            let latest = entries[0];
            let preview = latest
                .body
                .clone()
                .unwrap_or_else(|| format!("[{}]", latest.kind));
            let arrow = if latest.direction == "in" { "←" } else { "→" };

            format!(
                r#"<a class="thread" href="/api/admin/whatsapp?token={token}&phone={phone}"{current}>
<span class="when">{when}</span>
<span class="who">{label} {arrow}</span>
<span class="preview">{preview}</span>
</a>"#,
                token = token_html,
                phone = urlencode(phone),
                current = if phone == &current { " aria-current=\"true\"" } else { "" },
                when = clock(latest.created_at),
                label = escape(phone),
                arrow = arrow,
                preview = escape(&truncate(&preview, 60)),
            )
        })
        .collect::<String>();

    let mut thread = threads[&current].clone();
    thread.reverse();

    let bubbles = thread
        .iter()
        .map(|message| {
            let outgoing = message.direction == "out";
            let body = message
                .body
                .clone()
                .unwrap_or_else(|| format!("[{}]", message.kind));
            let status = message
                .status
                .as_deref()
                .map(status_label)
                .filter(|label| !label.is_empty())
                .unwrap_or_default();

            format!(
                r#"<div class="bubble{direction}"><div class="text">{body}</div><div class="meta"><span>{when}</span><span>{status}</span></div></div>"#,
                direction = if outgoing { " out" } else { "" },
                body = escape(&body),
                when = clock(message.created_at),
                status = status,
            )
        })
        .collect::<String>();

    let count = thread.len();

    let mut page = shell(
        "heaveless · whatsapp",
        &format!(
            r#"<header>
  <h1>heaveless</h1>
  <span class="label"><span class="dot"></span>whatsapp inbox</span>
</header>
<main>
  <nav class="threads">
    <span class="label">{conversations} conversaciones</span>
    {threads}
  </nav>
  <section class="panel">
    <div class="panel-head">
      <div><strong>{current}</strong><div class="label">{count} mensajes</div></div>
      <span class="label">se actualiza cada 20 s</span>
    </div>
    <div class="messages">{bubbles}</div>
    <form class="composer" method="post" action="/api/admin/whatsapp/send">
      <input type="hidden" name="token" value="{token}">
      <input type="hidden" name="to" value="{current}">
      <label class="label" for="body" style="display:none">Mensaje</label>
      <textarea id="body" name="body" placeholder="Escribe una respuesta…" required></textarea>
      <button type="submit">Enviar</button>
    </form>
  </section>
</main>"#,
            conversations = order.len(),
            threads = thread_rows,
            current = escape(&current),
            count = count,
            bubbles = bubbles,
            token = token_html,
        ),
    );

    page = page.replace("</body>", &format!("{LIVE_SCRIPT}</body>"));
    page
}

/// Keeps the thread live without clobbering a half-written reply.
const LIVE_SCRIPT: &str = r#"<script>
  const list = document.querySelector('.messages');
  if (list) list.scrollTop = list.scrollHeight;
  setInterval(() => {
    const box = document.querySelector('.composer textarea');
    if (document.hidden || (box && box.value.trim() !== '')) return;
    if (list && list.scrollHeight - list.scrollTop - list.clientHeight > 120) return;
    location.reload();
  }, 20000);
</script>"#;
