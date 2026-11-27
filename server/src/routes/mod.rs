pub mod auth;
pub mod health;
pub mod supporters;
pub mod whatsapp;

use std::sync::Arc;

use axum::http::{header, HeaderValue, Method};
use axum::routing::{get, post};
use axum::Router;
use sqlx::PgPool;
use tower_http::cors::{AllowOrigin, CorsLayer};
use tower_http::trace::TraceLayer;

use crate::config::Config;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub config: Arc<Config>,
}

pub fn router(state: AppState) -> Router {
    let origin = AllowOrigin::exact(
        state
            .config
            .web_origin
            .parse::<HeaderValue>()
            .expect("WEB_ORIGIN must be a valid origin"),
    );

    let cors = CorsLayer::new()
        .allow_origin(origin)
        .allow_credentials(true)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers([header::CONTENT_TYPE]);

    Router::new()
        .route("/api/health", get(health::health))
        .route("/api/auth/session", get(auth::session))
        .route("/api/auth/tiktok/start", get(auth::start))
        .route("/api/auth/tiktok/callback", get(auth::callback))
        .route("/api/auth/logout", post(auth::logout))
        .route("/api/supporters", get(supporters::list))
        .route(
            "/api/whatsapp/webhook",
            get(whatsapp::verify).post(whatsapp::receive),
        )
        .route("/api/whatsapp/send", post(whatsapp::send))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state)
}
