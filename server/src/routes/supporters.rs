use axum::extract::State;
use axum::Json;
use serde::Serialize;
use uuid::Uuid;

use super::AppState;
use crate::error::ApiResult;

#[derive(Serialize, sqlx::FromRow)]
pub struct Supporter {
    pub id: Uuid,
    pub name: String,
    pub avatar: String,
}

pub async fn list(State(state): State<AppState>) -> ApiResult<Json<Vec<Supporter>>> {
    let supporters = sqlx::query_as::<_, Supporter>(
        "select id, name, avatar from supporters order by created_at asc",
    )
    .fetch_all(&state.pool)
    .await?;

    Ok(Json(supporters))
}
