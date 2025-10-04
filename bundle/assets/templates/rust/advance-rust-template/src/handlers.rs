use actix_web::{HttpResponse, Responder};
use serde::Serialize;

#[derive(Serialize)]
struct HealthResponse {
    success: bool,
    message: &'static str,
    timestamp: String,
}

pub async fn health() -> impl Responder {
    HttpResponse::Ok().json(HealthResponse {
        success: true,
        message: "Server is healthy",
        timestamp: chrono::Utc::now().to_rfc3339(),
    })
}

#[derive(Serialize)]
struct HelloResponse {
    message: &'static str,
}

pub async fn hello() -> impl Responder {
    HttpResponse::Ok().json(HelloResponse {
        message: "Hello from Rust API!",
    })
} 