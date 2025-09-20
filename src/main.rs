use std::process::Command;

fn main() {
    let status = Command::new("node")
        .arg("dist/index.js")
        .args(std::env::args().skip(1))
        .status()
        .expect("Failed to execute TypeScript CLI");
    std::process::exit(status.code().unwrap_or(1));
}
