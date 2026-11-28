use std::collections::HashMap;

use axum::extract::{Query, State};
use axum::http::StatusCode;
use axum::response::{Html, IntoResponse, Redirect, Response};
use axum::Form;
use chrono::{DateTime, Datelike, Local, Utc};
use serde::Deserialize;

use super::whatsapp::{constant_time_eq, deliver, recent_messages, MessageRecord, SendRequest};
use super::AppState;

const MONTHS: [&str; 12] = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
];

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

    let back = format!(
        "/api/admin/whatsapp?token={}&phone={}",
        urlencode(expected),
        urlencode(&to)
    );

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

fn initials(name: &str) -> String {
    let mut letters = name
        .split_whitespace()
        .filter_map(|word| word.chars().next())
        .take(2)
        .collect::<String>()
        .to_uppercase();

    if letters.is_empty() {
        letters = "?".to_string();
    }

    letters
}

fn clock(value: DateTime<Utc>) -> String {
    let local = value.with_timezone(&Local);

    if local.date_naive() == Local::now().date_naive() {
        local.format("%H:%M").to_string()
    } else {
        local.format("%d/%m").to_string()
    }
}

fn day_label(value: DateTime<Utc>) -> String {
    let local = value.with_timezone(&Local);
    let today = Local::now().date_naive();
    let day = local.date_naive();

    if day == today {
        "Hoy".to_string()
    } else if (today - day).num_days() == 1 {
        "Ayer".to_string()
    } else {
        format!("{} de {}", day.day(), MONTHS[(day.month() - 1) as usize])
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

const STYLE: &str = r#"<style>
  :root {
    --night: #11110f;
    --surface: #191916;
    --surface-2: #201f1b;
    --ink: #f5f2ec;
    --muted: rgba(245, 242, 236, .55);
    --line: rgba(245, 242, 236, .12);
    --coral: #ff5666;
    --sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Arial, sans-serif;
    --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  }
  * { box-sizing: border-box; }
  html { color-scheme: dark; }
  body {
    margin: 0; min-height: 100dvh; background: var(--night); color: var(--ink);
    font-family: var(--sans); font-size: 15px; line-height: 1.5;
    -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
  }
  a { color: inherit; text-decoration: none; }
  .label {
    font-family: var(--mono); font-size: 10px; letter-spacing: .16em;
    text-transform: uppercase; color: var(--muted);
  }
  .top {
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    height: 58px; padding: 0 22px; border-bottom: 1px solid var(--line);
  }
  .brand { display: flex; align-items: baseline; gap: 10px; }
  .brand strong { font-size: 16px; font-weight: 600; letter-spacing: -.02em; }
  .live { display: flex; align-items: center; gap: 8px; }
  .live i {
    width: 5px; height: 5px; border-radius: 50%; background: var(--coral);
    display: block; box-shadow: 0 0 0 3px rgba(255, 86, 102, .16);
  }
  main {
    display: grid; grid-template-columns: 318px minmax(0, 1fr);
    height: calc(100dvh - 58px);
  }
  main.solo { grid-template-columns: minmax(0, 1fr); }
  .threads {
    border-right: 1px solid var(--line); overflow-y: auto;
    padding: 18px 10px 18px;
  }
  .threads > .label { padding: 0 12px 12px; display: block; }
  .thread {
    display: grid; grid-template-columns: 34px minmax(0, 1fr) auto; gap: 11px;
    align-items: center; padding: 10px 12px; border-radius: 10px;
    border: 1px solid transparent;
  }
  .thread:hover { background: rgba(245, 242, 236, .035); }
  .thread[aria-current="true"] { background: var(--surface); border-color: var(--line); }
  .avatar {
    width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center;
    background: var(--surface-2); border: 1px solid var(--line);
    font-family: var(--mono); font-size: 11px; letter-spacing: .04em; color: var(--muted);
  }
  .thread[aria-current="true"] .avatar { color: var(--ink); border-color: rgba(255, 86, 102, .35); }
  .stack { min-width: 0; display: block; overflow: hidden; }
  .who {
    display: block; font-weight: 550; font-size: 14px; letter-spacing: -.01em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .preview {
    display: block; color: var(--muted); font-size: 12.5px; margin-top: 1px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .when { font-family: var(--mono); font-size: 10px; color: var(--muted); letter-spacing: .08em; }
  .panel { display: flex; flex-direction: column; min-width: 0; }
  .panel-head {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 24px; border-bottom: 1px solid var(--line);
  }
  .panel-head .meta { min-width: 0; }
  .panel-head .who { font-size: 15px; }
  .panel-head .sub { font-family: var(--mono); font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
  .messages {
    flex: 1; overflow-y: auto; padding: 26px 24px 18px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .messages > .day {
    align-self: center; margin: 12px 0 6px; padding: 3px 10px; border-radius: 999px;
    background: var(--surface); border: 1px solid var(--line);
    font-family: var(--mono); font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
    color: var(--muted);
  }
  .messages > .day:first-child { margin-top: auto; }
  .bubble {
    max-width: min(540px, 78%); padding: 10px 13px 8px; border-radius: 15px 15px 15px 5px;
    background: var(--surface); border: 1px solid var(--line);
    white-space: pre-wrap; overflow-wrap: anywhere;
  }
  .bubble.out {
    align-self: flex-end; border-radius: 15px 15px 5px 15px;
    background: rgba(255, 86, 102, .08); border-color: rgba(255, 86, 102, .22);
  }
  .bubble .text { font-size: 14.5px; }
  .bubble .meta {
    display: flex; gap: 7px; align-items: center; justify-content: flex-end;
    margin-top: 4px; font-family: var(--mono); font-size: 10px;
    letter-spacing: .1em; text-transform: uppercase; color: var(--muted);
  }
  .bubble.in .meta { justify-content: flex-start; }
  .bubble.out .meta .state { color: rgba(255, 86, 102, .8); }
  .composer {
    display: flex; gap: 10px; align-items: flex-end;
    padding: 14px 24px 18px; border-top: 1px solid var(--line);
  }
  .composer textarea {
    flex: 1; min-height: 46px; max-height: 168px; resize: vertical;
    padding: 12px 14px; border-radius: 12px; border: 1px solid var(--line);
    background: var(--surface); color: var(--ink); font: inherit; font-size: 14.5px;
  }
  .composer textarea::placeholder { color: var(--muted); }
  .composer button {
    padding: 12px 24px; border: 0; border-radius: 999px; cursor: pointer;
    background: var(--coral); color: #17090b; font: inherit; font-weight: 600;
    letter-spacing: -.01em;
  }
  .composer button:hover { background: #ff6b78; }
  textarea:focus-visible, button:focus-visible, .thread:focus-visible {
    outline: 2px solid var(--coral); outline-offset: 2px;
  }
  .empty {
    margin: auto; padding: 48px 24px; max-width: 46ch; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
  }
  .empty strong { display: block; margin-bottom: 6px; font-weight: 600; }
  .empty p { margin: 0; color: var(--muted); font-size: 14px; }
  .empty .label { display: block; margin-bottom: 18px; }
  @media (max-width: 860px) {
    main { grid-template-columns: 1fr; grid-template-rows: auto minmax(0, 1fr); height: auto; min-height: calc(100dvh - 58px); }
    .threads { border-right: 0; border-bottom: 1px solid var(--line); max-height: 38dvh; }
    .panel { min-height: 62dvh; }
    .messages { padding: 18px 16px 12px; }
    .composer { padding: 12px 16px 16px; }
    .bubble { max-width: 88%; }
  }
</style>"#;

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

fn shell(title: &str, body: &str) -> String {
    format!(
        r#"<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>{title}</title>
{style}
</head>
<body>
{body}
</body>
</html>"#,
        title = escape(title),
        style = STYLE,
        body = body,
    )
}

/// Graph failures arrive as JSON; show the sentence Meta wrote, not the envelope.
fn human_error(detail: &str) -> String {
    if let Ok(value) = serde_json::from_str::<serde_json::Value>(detail) {
        if let Some(message) = value
            .get("error")
            .and_then(|error| error.get("message").or(Some(error)))
            .and_then(|error| error.as_str())
        {
            return message.to_string();
        }
    }

    detail.to_string()
}

fn error_page(status: u16, detail: &str, back: &str) -> String {
    shell(
        "heaveless · whatsapp",
        &format!(
            r#"<header class="top"><span class="brand"><strong>heaveless</strong><span class="label">whatsapp inbox</span></span></header>
<main class="solo"><section class="panel"><div class="empty">
<span class="label">error {status}</span>
<strong>No se pudo enviar el mensaje</strong>
<p>{detail}</p>
<p style="margin-top:18px"><a class="label" href="{back}">volver a la bandeja</a></p>
</div></section></main>"#,
            status = status,
            detail = escape(&truncate(&human_error(detail), 240)),
            back = escape(back),
        ),
    )
}

fn render(messages: &[MessageRecord], token: &str, selected: Option<&str>) -> String {
    let token_html = escape(token);

    if messages.is_empty() {
        return shell(
            "heaveless · whatsapp",
            r#"<header class="top"><span class="brand"><strong>heaveless</strong><span class="label">whatsapp inbox</span></span></header>
<main class="solo"><section class="panel"><div class="empty">
<span class="label">sin actividad</span>
<strong>Todavía no hay mensajes</strong>
<p>Cuando alguien escriba al número de WhatsApp del negocio, la conversación aparece aquí.</p>
</div></section></main>"#,
        );
    }

    // Group by phone, newest conversation first.
    let mut order: Vec<String> = Vec::new();
    let mut threads: HashMap<String, Vec<&MessageRecord>> = HashMap::new();
    let mut names: HashMap<String, String> = HashMap::new();

    for message in messages {
        if !threads.contains_key(&message.phone) {
            order.push(message.phone.clone());
        }
        if let Some(name) = message.contact_name.as_deref() {
            names
                .entry(message.phone.clone())
                .or_insert_with(|| name.to_string());
        }
        threads.entry(message.phone.clone()).or_default().push(message);
    }

    let label_for = |phone: &str| -> String {
        names
            .get(phone)
            .cloned()
            .unwrap_or_else(|| phone.to_string())
    };

    let current = selected
        .filter(|phone| threads.contains_key(*phone))
        .map(str::to_string)
        .unwrap_or_else(|| order[0].clone());

    let thread_rows = order
        .iter()
        .map(|phone| {
            let entries = &threads[phone];
            let latest = entries[0];
            let body = latest
                .body
                .clone()
                .unwrap_or_else(|| format!("[{}]", latest.kind));
            let preview = if latest.direction == "out" {
                format!("Tú: {body}")
            } else {
                body
            };
            let name = label_for(phone);

            format!(
                r#"<a class="thread" href="/api/admin/whatsapp?token={token}&phone={phone}"{current}>
<span class="avatar">{initials}</span>
<span class="stack">
  <span class="who" title="{name}">{name}</span>
  <span class="preview" title="{preview_full}">{preview}</span>
</span>
<span class="when">{when}</span>
</a>"#,
                token = token_html,
                phone = urlencode(phone),
                current = if phone == &current {
                    " aria-current=\"true\""
                } else {
                    ""
                },
                initials = escape(&initials(&name)),
                name = escape(&name),
                preview = escape(&truncate(&preview, 48)),
                preview_full = escape(&preview),
                when = clock(latest.created_at),
            )
        })
        .collect::<String>();

    let mut thread = threads[&current].clone();
    thread.reverse();

    let mut bubbles = String::new();
    let mut last_day: Option<String> = None;

    for message in &thread {
        let day = day_label(message.created_at);
        if last_day.as_deref() != Some(day.as_str()) {
            bubbles.push_str(&format!(r#"<div class="day">{}</div>"#, escape(&day)));
            last_day = Some(day);
        }

        let outgoing = message.direction == "out";
        let body = message
            .body
            .clone()
            .unwrap_or_else(|| format!("[{}]", message.kind));
        let state = message
            .status
            .as_deref()
            .map(status_label)
            .filter(|label| !label.is_empty());

        let meta = match state {
            Some(state) if outgoing => format!(
                r#"<div class="meta"><span>{}</span><span class="state">{}</span></div>"#,
                escape(&clock(message.created_at)),
                escape(state)
            ),
            _ => format!(
                r#"<div class="meta"><span>{}</span></div>"#,
                escape(&clock(message.created_at))
            ),
        };

        bubbles.push_str(&format!(
            r#"<div class="bubble {direction}"><div class="text">{body}</div>{meta}</div>"#,
            direction = if outgoing { "out" } else { "in" },
            body = escape(&body),
            meta = meta,
        ));
    }

    let count = thread.len();
    let plural = if count == 1 { "mensaje" } else { "mensajes" };
    let threads_label = if order.len() == 1 {
        "conversación"
    } else {
        "conversaciones"
    };
    let current_name = label_for(&current);

    let page = shell(
        "heaveless · whatsapp",
        &format!(
            r#"<header class="top">
  <span class="brand"><strong>heaveless</strong><span class="label">whatsapp inbox</span></span>
  <span class="live"><i></i><span class="label">{live}</span></span>
</header>
<main>
  <nav class="threads" aria-label="Conversaciones">
    <span class="label">{conversations} {threads_label}</span>
    {threads}
  </nav>
  <section class="panel">
    <div class="panel-head">
      <span class="avatar">{initials}</span>
      <span class="meta">
        <div class="who">{current_name}</div>
        <div class="sub">{current_phone} · {count} {plural}</div>
      </span>
    </div>
    <div class="messages">{bubbles}</div>
    <form class="composer" method="post" action="/api/admin/whatsapp/send">
      <input type="hidden" name="token" value="{token}">
      <input type="hidden" name="to" value="{current_phone_attr}">
      <label class="label" for="body" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Mensaje</label>
      <textarea id="body" name="body" placeholder="Escribe una respuesta…" required></textarea>
      <button type="submit">Enviar</button>
    </form>
  </section>
</main>"#,
            live = "en vivo",
            conversations = order.len(),
            threads_label = threads_label,
            threads = thread_rows,
            initials = escape(&initials(&current_name)),
            current_name = escape(&current_name),
            current_phone = escape(&current),
            current_phone_attr = escape(&current),
            count = count,
            plural = plural,
            bubbles = bubbles,
            token = token_html,
        ),
    );

    page.replace("</body>", &format!("{LIVE_SCRIPT}</body>"))
}
