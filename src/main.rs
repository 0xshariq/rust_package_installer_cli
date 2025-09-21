use std::env;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use reqwest::blocking::Client;
use dirs::cache_dir;

const GITHUB_REPO: &str = "0xshariq/rust_package_installer_cli";
const CLI_VERSION: &str = "latest"; // You can make this configurable
const CACHE_DIR_NAME: &str = ".package-installer-cli";

fn main() {
    let args: Vec<String> = env::args().collect();
    
    // Check if the binary name contains "pi" or if first argument is "pi"
    let binary_name = &args[0];
    let should_run_cli = binary_name.contains("pi") || 
                        (args.len() > 1 && args[1] == "pi");
    
    if should_run_cli {
        // Get CLI arguments
        let cli_args = if binary_name.contains("pi") {
            args.iter().skip(1).cloned().collect::<Vec<String>>()
        } else {
            args.iter().skip(2).cloned().collect::<Vec<String>>()
        };
        
        // Ensure CLI is downloaded and cached
        let cli_path = ensure_cli_available().expect("Failed to download or find CLI");
        
        // Run the CLI
        let status = Command::new("node")
            .arg(&cli_path)
            .args(&cli_args)
            .status()
            .expect("Failed to execute TypeScript CLI. Make sure Node.js is installed.");
        
        std::process::exit(status.code().unwrap_or(1));
    } else {
        println!("Usage: pi [command] [options]");
        println!("This is a Rust wrapper for the Package Installer CLI.");
        println!("Use the binary name directly followed by your command to run the CLI.");
        println!("Example: pi create my-app");
        std::process::exit(1);
    }
}

fn ensure_cli_available() -> Result<PathBuf, Box<dyn std::error::Error>> {
    let cache_dir = get_cache_dir()?;
    let cli_path = cache_dir.join("dist").join("index.js");
    
    // Check if CLI already exists in cache
    if cli_path.exists() {
        println!("Using cached CLI at: {:?}", cli_path);
        return Ok(cli_path);
    }
    
    println!("CLI not found in cache, downloading from GitHub...");
    download_cli(&cache_dir)?;
    
    if cli_path.exists() {
        println!("CLI downloaded successfully to: {:?}", cli_path);
        Ok(cli_path)
    } else {
        Err("Failed to find CLI after download".into())
    }
}

fn get_cache_dir() -> Result<PathBuf, Box<dyn std::error::Error>> {
    let cache_base = cache_dir().ok_or("Could not determine cache directory")?;
    let cache_path = cache_base.join(CACHE_DIR_NAME);
    
    if !cache_path.exists() {
        fs::create_dir_all(&cache_path)?;
    }
    
    Ok(cache_path)
}

fn download_cli(cache_dir: &Path) -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new();
    
    // Get the latest release info
    let release_url = format!("https://api.github.com/repos/{}/releases/{}", GITHUB_REPO, CLI_VERSION);
    let release_response = client.get(&release_url)
        .header("User-Agent", "package-installer-cli-rust-wrapper")
        .send()?;
    
    if !release_response.status().is_success() {
        return Err(format!("Failed to fetch release info: {}", release_response.status()).into());
    }
    
    let release_text = release_response.text()?;
    let release_json: serde_json::Value = serde_json::from_str(&release_text)?;
    
    // Find the tarball URL
    let tarball_url = release_json["tarball_url"]
        .as_str()
        .ok_or("Could not find tarball URL in release")?;
    
    println!("Downloading from: {}", tarball_url);
    
    // Download the tarball
    let tarball_response = client.get(tarball_url)
        .header("User-Agent", "package-installer-cli-rust-wrapper")
        .send()?;
    
    if !tarball_response.status().is_success() {
        return Err(format!("Failed to download tarball: {}", tarball_response.status()).into());
    }
    
    let tarball_bytes = tarball_response.bytes()?;
    
    // Extract the tarball
    let tar = flate2::read::GzDecoder::new(&tarball_bytes[..]);
    let mut archive = tar::Archive::new(tar);
    
    // Extract to a temporary directory first
    let temp_dir = cache_dir.join("temp");
    if temp_dir.exists() {
        fs::remove_dir_all(&temp_dir)?;
    }
    fs::create_dir_all(&temp_dir)?;
    
    archive.unpack(&temp_dir)?;
    
    // Find the extracted directory (GitHub creates a directory with repo name and commit hash)
    let mut extracted_dir = None;
    for entry in fs::read_dir(&temp_dir)? {
        let entry = entry?;
        if entry.file_type()?.is_dir() {
            extracted_dir = Some(entry.path());
            break;
        }
    }
    
    let extracted_dir = extracted_dir.ok_or("Could not find extracted directory")?;
    
    // Look for dist/index.js in the extracted directory
    let dist_dir = extracted_dir.join("dist");
    if dist_dir.exists() {
        // Copy the dist directory to cache
        copy_dir_all(&dist_dir, &cache_dir.join("dist"))?;
    } else {
        return Err("dist/index.js not found in the downloaded release".into());
    }
    
    // Clean up temp directory
    fs::remove_dir_all(&temp_dir)?;
    
    Ok(())
}

fn copy_dir_all(src: impl AsRef<Path>, dst: impl AsRef<Path>) -> std::io::Result<()> {
    fs::create_dir_all(&dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        if ty.is_dir() {
            copy_dir_all(entry.path(), dst.as_ref().join(entry.file_name()))?;
        } else {
            fs::copy(entry.path(), dst.as_ref().join(entry.file_name()))?;
        }
    }
    Ok(())
}
