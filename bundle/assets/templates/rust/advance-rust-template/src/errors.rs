use actix_web::{HttpResponse, ResponseError};
use derive_more::Display;
use serde::Serialize;

#[derive(Debug, Display, Serialize)]
#[display(fmt = "{}", message)]
pub struct ApiError {
    pub message: String,
    pub status_code: u16,
}

impl ResponseError for ApiError {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(actix_web::http::StatusCode::from_u16(self.status_code).unwrap_or(actix_web::http::StatusCode::INTERNAL_SERVER_ERROR))
            .json(self)
    }
} 