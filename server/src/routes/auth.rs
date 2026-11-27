use std::collections::HashMap;

use axum::extract::{Query, State};
use axum::http::{header, HeaderMap, HeaderValue, StatusCode};
use axum::response::{IntoResponse, Redirect, Response};
use axum::Json;
use serde_json::json;
use uuid::Uuid;

use super::AppState;
use crate::cookies;
use crate::error::ApiResult;
use crate::session;

const SESSION_COOKIE: &str = "hl_session";
const STATE_COOKIE: &str = "hl_oauth_state";
const STATE_TTL_SECONDS: i64 = 600;

fn with_cookies(response: Response, cookies: &[String]) -> Response {
    let mut response = response;
    for cookie in cookies {
        if let Ok(value) = HeaderValue::from_str(cookie) {
            response.headers_mut().append(header::SET_COOKIE, value);
        }
    }
    response
}

fn to_web(state: &AppState, path: &str) -> Redirect {
    Redirect::to(&format!("{}{}", state.config.web_origin.trim_end_matches('/'), path))
}

fn failure(state: &AppState, reason: &str) -> Response {
    to_web(state, &format!("/event?auth={reason}")).into_response()
}

pub async fn start(State(state): State<AppState>) -> Response {
    let value = session::token();
    let secret = &state.config.session_secret;
    let cookie = cookies::build(
        STATE_COOKIE,
        &cookies::signed(secret, &value),
        STATE_TTL_SECONDS,
        state.config.cookie_secure,
    );

    let url = state
        .config
        .tiktok
        .authorize_url(&state.config.callback_url(), &value);

    with_cookies(Redirect::to(&url).into_response(), &[cookie])
}

pub async fn callback(
    State(state): State<AppState>,
    headers: HeaderMap,
    Query(params): Query<HashMap<String, String>>,
) -> Response {
    let secret = &state.config.session_secret;
    let expected_state = cookies::read_signed(&headers, STATE_COOKIE, secret);
    let cleared = cookies::removal(STATE_COOKIE, state.config.cookie_secure);

    if let Some(error) = params.get("error") {
        tracing::warn!(error, description = params.get("error_description"), "tiktok authorize returned an error");
        return with_cookies(failure(&state, "error"), &[cleared]);
    }

    let code = params.get("code").cloned().unwrap_or_default();
    let received_state = params.get("state").cloned().unwrap_or_default();

    let state_matches = expected_state
        .as_deref()
        .map(|expected| cookies::equals(expected, &received_state))
        .unwrap_or(false);

    if code.is_empty() || !state_matches {
        return with_cookies(failure(&state, "error"), &[cleared]);
    }

    match complete_login(&state, &code).await {
        Ok(cookie) => {
            let response = to_web(&state, "/event#wall").into_response();
            with_cookies(response, &[cleared, cookie])
        }
        Err(error) => {
            tracing::error!(%error, "tiktok login failed");
            with_cookies(failure(&state, "error"), &[cleared])
        }
    }
}

async fn complete_login(state: &AppState, code: &str) -> anyhow::Result<String> {
    let config = &state.config;
    let token = config.tiktok.exchange_code(code, &config.callback_url()).await?;
    let profile = config.tiktok.profile(&token).await?;

    let id: Uuid = sqlx::query_scalar(
        "insert into supporters (tiktok_open_id, name, avatar)
              values ($1, $2, $3)
         on conflict (tiktok_open_id)
           do update set name = excluded.name, avatar = excluded.avatar
           returning id",
    )
    .bind(&profile.open_id)
    .bind(&profile.name)
    .bind(&profile.avatar)
    .fetch_one(&state.pool)
    .await?;

    let session_id = session::create(&state.pool, id, config.session_ttl_days).await?;

    Ok(cookies::build(
        SESSION_COOKIE,
        &cookies::signed(&config.session_secret, &session_id),
        config.session_ttl_days * 86_400,
        config.cookie_secure,
    ))
}

pub async fn session(State(state): State<AppState>, headers: HeaderMap) -> ApiResult<Response> {
    let user = current_user(&state, &headers).await?;
    Ok(Json(json!({ "user": user })).into_response())
}

pub async fn logout(State(state): State<AppState>, headers: HeaderMap) -> ApiResult<Response> {
    let secret = &state.config.session_secret;

    if let Some(token) = cookies::read_signed(&headers, SESSION_COOKIE, secret) {
        session::delete(&state.pool, &token).await?;
    }

    let cleared = cookies::removal(SESSION_COOKIE, state.config.cookie_secure);
    let response = (StatusCode::OK, Json(json!({ "ok": true }))).into_response();
    Ok(with_cookies(response, &[cleared]))
}

async fn current_user(state: &AppState, headers: &HeaderMap) -> ApiResult<Option<session::User>> {
    let secret = &state.config.session_secret;
    let Some(token) = cookies::read_signed(headers, SESSION_COOKIE, secret) else {
        return Ok(None);
    };

    Ok(session::user(&state.pool, &token).await?)
}
