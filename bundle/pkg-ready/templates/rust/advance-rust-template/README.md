# Rust Actix-Web API Template

A modern, production-ready Rust web API template using Actix-web, with best practices for configuration, error handling, CORS, logging, and testing.

## 🚀 Features
- **Actix-web**: Fast, stable, and production-ready web framework
- **Environment config**: Uses dotenv for configuration
- **CORS**: Secure cross-origin resource sharing
- **Logging**: Built-in logging with env_logger
- **Error handling**: Centralized error responses
- **JSON API**: Serde for (de)serialization
- **Testing**: Async integration tests with reqwest and tokio
- **Project structure**: Modular and extensible

## 📁 Project Structure
```
├── src/
│   ├── main.rs           # Application entry point
│   ├── config.rs         # Environment/config loading
│   ├── routes.rs         # Route definitions
│   ├── handlers.rs       # Request handlers/controllers
│   ├── models.rs         # Data models (serde structs)
│   └── errors.rs         # Error types and responses
├── tests/
│   └── integration.rs    # Integration tests
├── Cargo.toml            # Dependencies and metadata
├── env.example           # Example environment variables
└── README.md             # This file
```

## 🛠️ Getting Started

### 1. Install Rust
- [Install Rust](https://rustup.rs/)

### 2. Clone the template
```bash
git clone <repo-url> my-api
cd my-api
```

### 3. Set up environment variables
```bash
cp env.example .env
```
Edit `.env` as needed:
```
PORT=8080
RUST_LOG=info
ENVIRONMENT=development
```

### 4. Run the server
```bash
cargo run
```

### 5. Run tests
```bash
cargo test
```

## 📝 API Endpoints

- `GET /health` — Health check
- `GET /api/v1/hello` — Example JSON endpoint

## 🧩 Extending
- Add new routes in `routes.rs`
- Implement handlers in `handlers.rs`
- Define models in `models.rs`
- Add error types in `errors.rs`

## 🛡️ Security & Best Practices
- CORS enabled for development (edit in `main.rs` for production)
- Centralized error handling
- Logging via `env_logger`
- Environment config via `.env`

## 📄 License
MIT 