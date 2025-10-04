use actix_web::web;
use crate::handlers;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg
        .service(web::resource("/health").route(web::get().to(handlers::health)))
        .service(web::scope("/api/v1")
            .service(web::resource("/hello").route(web::get().to(handlers::hello)))
        );
} 