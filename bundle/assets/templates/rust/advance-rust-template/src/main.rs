mod config;
mod routes;
mod errors;
mod handlers;
mod models;

use actix_web::{App, HttpServer, middleware::Logger};
use dotenv::dotenv;
use std::env;
use actix_cors::Cors;
use env_logger::Env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    let config = config::Config::from_env().expect("Failed to load config");
    let bind_addr = format!("0.0.0.0:{}", config.port);

    println!("🚀 Starting server at http://{}", bind_addr);

    HttpServer::new(move || {
        let cors = Cors::permissive(); // For dev; restrict in prod
        App::new()
            .wrap(Logger::default())
            .wrap(cors)
            .configure(routes::init)
    })
    .bind(bind_addr)?
    .run()
    .await
} 