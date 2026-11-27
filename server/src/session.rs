use chrono::Utc;
use rand::RngCore;
use serde::Serialize;
use sqlx::PgPool;
use uuid::Uuid;

#[derive(Clone, Debug, Serialize, sqlx::FromRow)]
pub struct User {
    pub id: Uuid,
    pub name: String,
    pub avatar: String,
}

pub fn token() -> String {
    let mut bytes = [0u8; 32];
    rand::thread_rng().fill_bytes(&mut bytes);
    hex::encode(bytes)
}

pub async fn create(pool: &PgPool, user_id: Uuid, ttl_days: i64) -> sqlx::Result<String> {
    let id = token();
    let expires_at = Utc::now() + chrono::Duration::days(ttl_days);

    sqlx::query("insert into sessions (id, supporter_id, expires_at) values ($1, $2, $3)")
        .bind(&id)
        .bind(user_id)
        .bind(expires_at)
        .execute(pool)
        .await?;

    Ok(id)
}

pub async fn user(pool: &PgPool, token: &str) -> sqlx::Result<Option<User>> {
    sqlx::query_as::<_, User>(
        "select s.id, s.name, s.avatar
           from sessions
           join supporters s on s.id = sessions.supporter_id
          where sessions.id = $1 and sessions.expires_at > now()",
    )
    .bind(token)
    .fetch_optional(pool)
    .await
}

pub async fn delete(pool: &PgPool, token: &str) -> sqlx::Result<()> {
    sqlx::query("delete from sessions where id = $1")
        .bind(token)
        .execute(pool)
        .await?;
    Ok(())
}

pub async fn purge_expired(pool: &PgPool) -> sqlx::Result<u64> {
    let result = sqlx::query("delete from sessions where expires_at <= now()")
        .execute(pool)
        .await?;
    Ok(result.rows_affected())
}
