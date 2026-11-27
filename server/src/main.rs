mod config;
mod cookies;
mod db;
mod error;
mod routes;
mod session;
mod tiktok;

use std::sync::Arc;

use anyhow::Result;
use tracing_subscriber::EnvFilter;

use crate::config::Config;
use crate::routes::AppState;

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info,tower_http=warn".into()))
        .init();

    let config = Config::from_env()?;
    let pool = db::pool(&config.database_url).await?;

    match session::purge_expired(&pool).await {
        Ok(0) => {}
        Ok(removed) => tracing::info!(removed, "purged expired sessions"),
        Err(error) => tracing::warn!(%error, "could not purge expired sessions"),
    }

    let port = config.port;
    let app = routes::router(AppState {
        pool,
        config: Arc::new(config),
    });

    let listener = tokio::net::TcpListener::bind(("0.0.0.0", port)).await?;
    tracing::info!(port, "heaveless api listening");

    axum::serve(listener, app).await?;
    Ok(())
}
