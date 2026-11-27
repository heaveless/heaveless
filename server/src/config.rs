use anyhow::{Context, Result};

use crate::tiktok::TikTokConfig;

pub struct Config {
    pub port: u16,
    pub database_url: String,
    pub session_secret: String,
    pub web_origin: String,
    pub public_url: String,
    pub session_ttl_days: i64,
    pub cookie_secure: bool,
    pub tiktok: TikTokConfig,
}

impl Config {
    pub fn from_env() -> Result<Self> {
        let database_url = std::env::var("DATABASE_URL").context("DATABASE_URL is required")?;
        let session_secret = std::env::var("SESSION_SECRET").context("SESSION_SECRET is required")?;
        let public_url = std::env::var("PUBLIC_URL").unwrap_or_else(|_| "http://localhost:8080".into());
        let web_origin = std::env::var("WEB_ORIGIN").unwrap_or_else(|_| "http://localhost:5173".into());

        Ok(Self {
            port: std::env::var("PORT").ok().and_then(|value| value.parse().ok()).unwrap_or(8080),
            session_ttl_days: std::env::var("SESSION_TTL_DAYS").ok().and_then(|value| value.parse().ok()).unwrap_or(7),
            cookie_secure: public_url.starts_with("https://"),
            database_url,
            session_secret,
            web_origin,
            public_url,
            tiktok: TikTokConfig {
                client_key: std::env::var("TIKTOK_CLIENT_KEY").unwrap_or_default(),
                client_secret: std::env::var("TIKTOK_CLIENT_SECRET").unwrap_or_default(),
            },
        })
    }

    pub fn callback_url(&self) -> String {
        format!("{}/api/auth/tiktok/callback", self.public_url.trim_end_matches('/'))
    }

    pub fn configured_for_tiktok(&self) -> bool {
        self.tiktok.is_configured()
    }
}
