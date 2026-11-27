use cookie::{Cookie, SameSite};
use hmac::{Hmac, Mac};
use sha2::Sha256;

type HmacSha256 = Hmac<Sha256>;

const PREFIX: &str = "s:";

fn signature(secret: &str, value: &str) -> String {
    let mut mac = HmacSha256::new_from_slice(secret.as_bytes()).expect("hmac accepts any key length");
    mac.update(value.as_bytes());
    hex::encode(mac.finalize().into_bytes())
}

fn verify(secret: &str, value: &str, received: &str) -> bool {
    let expected = signature(secret, value);
    if expected.len() != received.len() {
        return false;
    }
    expected
        .bytes()
        .zip(received.bytes())
        .fold(0u8, |acc, (a, b)| acc | (a ^ b))
        == 0
}

pub fn read(headers: &axum::http::HeaderMap, name: &str) -> Option<String> {
    let raw = headers.get(axum::http::header::COOKIE)?.to_str().ok()?;
    Cookie::split_parse(raw)
        .flatten()
        .find(|cookie| cookie.name() == name)
        .map(|cookie| cookie.value().to_string())
}

pub fn read_signed(headers: &axum::http::HeaderMap, name: &str, secret: &str) -> Option<String> {
    let value = read(headers, name)?;
    let value = value.strip_prefix(PREFIX)?;
    let (payload, received) = value.rsplit_once('.')?;
    verify(secret, payload, received).then(|| payload.to_string())
}

pub fn equals(left: &str, right: &str) -> bool {
    if left.len() != right.len() {
        return false;
    }
    left.bytes()
        .zip(right.bytes())
        .fold(0u8, |acc, (a, b)| acc | (a ^ b))
        == 0
}

pub fn signed(secret: &str, value: &str) -> String {
    format!("{PREFIX}{value}.{}", signature(secret, value))
}

pub fn build(name: &str, value: &str, max_age_seconds: i64, secure: bool) -> String {
    let mut cookie = Cookie::build((name, value))
        .http_only(true)
        .same_site(SameSite::Lax)
        .path("/")
        .secure(secure)
        .build();

    cookie.set_max_age(cookie::time::Duration::seconds(max_age_seconds));
    cookie.to_string()
}

pub fn removal(name: &str, secure: bool) -> String {
    build(name, "", 0, secure)
}
