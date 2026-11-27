use anyhow::{anyhow, Result};
use serde::Deserialize;

const AUTHORIZE_URL: &str = "https://www.tiktok.com/v2/auth/authorize/";
const TOKEN_URL: &str = "https://open.tiktokapis.com/v2/oauth/token/";
const USER_INFO_URL: &str = "https://open.tiktokapis.com/v2/user/info/";
const SCOPE: &str = "user.info.basic";
const FIELDS: &str = "open_id,union_id,avatar_url,display_name";

pub struct TikTokConfig {
    pub client_key: String,
    pub client_secret: String,
}

impl TikTokConfig {
    pub fn is_configured(&self) -> bool {
        !self.client_key.is_empty() && !self.client_secret.is_empty()
    }

    pub fn authorize_url(&self, redirect_uri: &str, state: &str) -> String {
        format!(
            "{AUTHORIZE_URL}?client_key={}&scope={SCOPE}&response_type=code&redirect_uri={}&state={}",
            urlencoding::encode(&self.client_key),
            urlencoding::encode(redirect_uri),
            urlencoding::encode(state),
        )
    }

    pub async fn exchange_code(&self, code: &str, redirect_uri: &str) -> Result<String> {
        let response = reqwest::Client::new()
            .post(TOKEN_URL)
            .form(&[
                ("client_key", self.client_key.as_str()),
                ("client_secret", self.client_secret.as_str()),
                ("code", code),
                ("grant_type", "authorization_code"),
                ("redirect_uri", redirect_uri),
            ])
            .send()
            .await?;

        let status = response.status();
        let body: serde_json::Value = response.json().await.unwrap_or_default();

        if !status.is_success() {
            return Err(anyhow!("token exchange failed ({status}): {body}"));
        }

        body["access_token"]
            .as_str()
            .map(str::to_string)
            .ok_or_else(|| anyhow!("token exchange returned no access token: {body}"))
    }

    pub async fn profile(&self, access_token: &str) -> Result<Profile> {
        let response = reqwest::Client::new()
            .get(USER_INFO_URL)
            .query(&[("fields", FIELDS)])
            .bearer_auth(access_token)
            .send()
            .await?;

        let status = response.status();
        let body: UserInfo = response.json().await.unwrap_or_default();

        if !status.is_success() {
            return Err(anyhow!("user info failed ({status})"));
        }

        let user = body.data.and_then(|data| data.user).ok_or_else(|| anyhow!("user info returned no user"))?;

        Ok(Profile {
            open_id: user.open_id,
            name: user.display_name.filter(|name| !name.trim().is_empty()).unwrap_or_else(|| "TikTok user".into()),
            avatar: user.avatar_url.unwrap_or_default(),
        })
    }
}

pub struct Profile {
    pub open_id: String,
    pub name: String,
    pub avatar: String,
}

#[derive(Default, Deserialize)]
struct UserInfo {
    data: Option<UserInfoData>,
}

#[derive(Default, Deserialize)]
struct UserInfoData {
    user: Option<TikTokUser>,
}

#[derive(Default, Deserialize)]
struct TikTokUser {
    open_id: String,
    display_name: Option<String>,
    avatar_url: Option<String>,
}
