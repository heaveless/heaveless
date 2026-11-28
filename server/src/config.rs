use std::fmt::Display;
use std::str::FromStr;

use anyhow::{anyhow, bail, Context, Result};
use url::Url;

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
    pub whatsapp: WhatsAppConfig,
}

pub struct WhatsAppConfig {
    /// Echoed back during Meta's GET challenge; unset disables the endpoint.
    pub verify_token: Option<String>,
    /// When set, POST payloads must carry a matching X-Hub-Signature-256.
    pub app_secret: Option<String>,
    /// System user token used to send messages; unset disables /api/whatsapp/send.
    pub access_token: Option<String>,
    /// The business phone number id messages are sent from.
    pub phone_number_id: Option<String>,
    /// Shared secret callers present as `Authorization: Bearer ...`.
    pub send_secret: Option<String>,
    /// Graph API version, for example `v23.0`.
    pub graph_version: String,
}

fn optional(name: &str) -> Option<String> {
    std::env::var(name)
        .ok()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

fn required(name: &str) -> Result<String> {
    let value = std::env::var(name).with_context(|| format!("{name} is required"))?;

    if value.trim().is_empty() {
        bail!("{name} is empty");
    }

    Ok(value)
}

fn parsed<T>(name: &str) -> Result<T>
where
    T: FromStr,
    T::Err: Display,
{
    let value = required(name)?;
    value
        .parse()
        .map_err(|error| anyhow!("{name} is not valid: {error}"))
}

fn origin(name: &str) -> Result<String> {
    let value = required(name)?;
    let url = Url::parse(&value).with_context(|| format!("{name} is not a URL: {value}"))?;

    if !matches!(url.scheme(), "http" | "https") || url.path() != "/" || url.query().is_some() {
        bail!("{name} must be a bare origin, for example https://heaveless.com");
    }

    Ok(value.trim_end_matches('/').to_string())
}

impl Config {
    pub fn from_env() -> Result<Self> {
        let public_url = origin("PUBLIC_URL")?;

        Ok(Self {
            port: parsed("PORT")?,
            session_ttl_days: parsed("SESSION_TTL_DAYS")?,
            cookie_secure: public_url.starts_with("https://"),
            database_url: required("DATABASE_URL")?,
            session_secret: required("SESSION_SECRET")?,
            web_origin: origin("WEB_ORIGIN")?,
            public_url,
            tiktok: TikTokConfig {
                client_key: required("TIKTOK_CLIENT_KEY")?,
                client_secret: required("TIKTOK_CLIENT_SECRET")?,
            },
            whatsapp: WhatsAppConfig {
                verify_token: optional("WHATSAPP_VERIFY_TOKEN"),
                app_secret: optional("WHATSAPP_APP_SECRET"),
                access_token: optional("WHATSAPP_ACCESS_TOKEN"),
                phone_number_id: optional("WHATSAPP_PHONE_NUMBER_ID"),
                send_secret: optional("WHATSAPP_SEND_SECRET"),
                graph_version: optional("WHATSAPP_GRAPH_VERSION").unwrap_or_else(|| "v23.0".to_string()),
            },
        })
    }

    pub fn callback_url(&self) -> String {
        format!("{}/api/auth/tiktok/callback", self.public_url)
    }
}
