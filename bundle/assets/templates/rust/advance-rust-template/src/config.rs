use std::env;

pub struct Config {
    pub port: u16,
    pub environment: String,
}

impl Config {
    pub fn from_env() -> Result<Self, String> {
        let port = env::var("PORT")
            .unwrap_or_else(|_| "8080".to_string())
            .parse::<u16>()
            .map_err(|_| "PORT must be a valid u16".to_string())?;
        let environment = env::var("ENVIRONMENT").unwrap_or_else(|_| "development".to_string());
        Ok(Config { port, environment })
    }
} 