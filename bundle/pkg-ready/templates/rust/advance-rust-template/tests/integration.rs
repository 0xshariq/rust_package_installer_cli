use actix_web::{test, App};
use rust_template::{routes, handlers};

#[actix_rt::test]
async fn test_health() {
    let app = test::init_service(App::new().configure(routes::init)).await;
    let req = test::TestRequest::get().uri("/health").to_request();
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
}

#[actix_rt::test]
async fn test_hello() {
    let app = test::init_service(App::new().configure(routes::init)).await;
    let req = test::TestRequest::get().uri("/api/v1/hello").to_request();
    let resp = test::call_service(&app, req).await;
    assert!(resp.status().is_success());
} 