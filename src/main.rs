use std::env;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use reqwest::blocking::Client;
use dirs::cache_dir;

const GITHUB_REPO: &str = "0xshariq/rust_package_installer_cli";
const CLI_VERSION: &str = "latest"; // You can make this configurable
const CACHE_DIR_NAME: &str = ".package-installer-cli";
const LOCAL_CLI_DIR: &str = "node_modules/@0xshariq/package-installer";

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
        match Command::new("node")
            .arg(&cli_path)
            .args(&cli_args)
            .status() {
            Ok(status) => {
                std::process::exit(status.code().unwrap_or(1));
            }
            Err(e) => {
                println!("❌ Failed to execute the CLI: {}", e);
                println!("");
                println!("This could be due to:");
                println!("1. Node.js is not installed - Visit: https://nodejs.org/en/download/");
                println!("2. Missing dependencies - Check the manual installation instructions above");
                println!("3. Corrupted cache - Try deleting the cache directory and running again");
                println!("   Cache location: {:?}", get_cache_dir().unwrap_or_default());
                std::process::exit(1);
            }
        }
    } else {
        println!("Usage: pi [command] [options]");
        println!("This is a Rust wrapper for the Package Installer CLI.");
        println!("Use the binary name directly followed by your command to run the CLI.");
        println!("Example: pi create my-app");
        std::process::exit(1);
    }
}

fn ensure_cli_available() -> Result<PathBuf, Box<dyn std::error::Error>> {
    // First, check for local installation (npm/yarn/pnpm installed version)
    if let Ok(local_cli) = check_local_installation() {
        println!("✅ Using locally installed CLI from node_modules");
        return Ok(local_cli);
    }
    
    // If no local installation, use cached/global installation
    let cache_dir = get_cache_dir()?;
    let cli_path = cache_dir.join("dist").join("index.js");
    
    // Check if CLI already exists in cache
    if cli_path.exists() {
        // Check if dependencies are installed
        if !dependencies_installed(&cache_dir) {
            println!("🔍 CLI found but dependencies not installed.");
            println!("🚀 Attempting to install dependencies automatically...");
            
            match install_dependencies(&cache_dir) {
                Ok(_) => {
                    println!("✅ Ready to use!");
                }
                Err(e) => {
                    println!("⚠️  Automatic installation failed: {}", e);
                    println!("💡 You can still use the CLI after manually installing dependencies.");
                }
            }
        } else {
            println!("✅ Using cached CLI with dependencies installed");
        }
        return Ok(cli_path);
    }
    
    println!("🔍 CLI not found in cache, downloading from GitHub...");
    download_cli(&cache_dir)?;
    
    if cli_path.exists() {
        println!("📦 CLI downloaded successfully!");
        Ok(cli_path)
    } else {
        Err("Failed to find CLI after download".into())
    }
}

fn check_local_installation() -> Result<PathBuf, Box<dyn std::error::Error>> {
    let current_dir = env::current_dir()?;
    
    // Check in current directory first
    let local_paths = vec![
        current_dir.join(LOCAL_CLI_DIR).join("dist").join("index.js"),
        current_dir.join("node_modules").join("@0xshariq").join("package-installer").join("dist").join("index.js"),
        current_dir.join("node_modules").join("package-installer-cli").join("dist").join("index.js"),
    ];
    
    for path in &local_paths {
        if path.exists() {
            return Ok(path.clone());
        }
    }
    
    // Check parent directories (up to 5 levels) for local installation
    let mut check_dir = current_dir.as_path();
    for _ in 0..5 {
        for local_path in &[
            "node_modules/@0xshariq/package-installer/dist/index.js",
            "node_modules/package-installer-cli/dist/index.js",
        ] {
            let full_path = check_dir.join(local_path);
            if full_path.exists() {
                return Ok(full_path);
            }
        }
        
        if let Some(parent) = check_dir.parent() {
            check_dir = parent;
        } else {
            break;
        }
    }
    
    Err("No local installation found".into())
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
    
    // Copy the entire project to cache (including package.json and dependencies info)
    copy_dir_all(&extracted_dir, cache_dir)?;
    
    // Install Node.js dependencies
    println!("Installing Node.js dependencies...");
    install_dependencies(cache_dir)?;
    
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

fn install_dependencies(cache_dir: &Path) -> Result<(), Box<dyn std::error::Error>> {
    let package_json_path = cache_dir.join("package.json");
    
    // Check if package.json exists
    if !package_json_path.exists() {
        return Err("package.json not found in the downloaded CLI".into());
    }
    
    // Determine which package manager to use
    let package_manager = detect_package_manager(cache_dir);
    
    println!("Installing dependencies using {}...", package_manager);
    println!("This may take a few moments...");
    
    // Run the package manager install command
    let mut cmd = Command::new(&package_manager);
    
    match package_manager.as_str() {
        "pnpm" => {
            cmd.arg("install").arg("--production").arg("--silent");
        }
        "yarn" => {
            cmd.arg("install").arg("--production").arg("--silent");
        }
        "npm" => {
            cmd.arg("install").arg("--production").arg("--silent");
        }
        _ => {
            print_manual_installation_instructions(cache_dir);
            return Err(format!("Unsupported package manager: {}", package_manager).into());
        }
    }
    
    let result = cmd
        .current_dir(cache_dir)
        .status();
    
    match result {
        Ok(status) => {
            if status.success() {
                println!("✅ Dependencies installed successfully!");
                Ok(())
            } else {
                println!("❌ Failed to install dependencies automatically.");
                print_manual_installation_instructions(cache_dir);
                Err(format!("Dependencies installation failed with {}", package_manager).into())
            }
        }
        Err(e) => {
            println!("❌ Failed to run {} install command.", package_manager);
            print_manual_installation_instructions(cache_dir);
            Err(format!("Failed to run {} install. Error: {}", package_manager, e).into())
        }
    }
}

fn detect_package_manager(cache_dir: &Path) -> String {
    // Check for lock files to determine the package manager
    if cache_dir.join("pnpm-lock.yaml").exists() {
        // Check if pnpm is available
        if Command::new("pnpm").arg("--version").output().is_ok() {
            return "pnpm".to_string();
        }
    }
    
    if cache_dir.join("yarn.lock").exists() {
        // Check if yarn is available
        if Command::new("yarn").arg("--version").output().is_ok() {
            return "yarn".to_string();
        }
    }
    
    // Default to npm
    "npm".to_string()
}

fn dependencies_installed(cache_dir: &Path) -> bool {
    let node_modules_path = cache_dir.join("node_modules");
    node_modules_path.exists() && node_modules_path.is_dir()
}

fn print_manual_installation_instructions(cache_dir: &Path) {
    println!("\n📋 MANUAL INSTALLATION REQUIRED:");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    println!("The CLI requires Node.js dependencies to function properly.");
    println!("You have two options:");
    println!("");
    
    println!("🌍 OPTION 1: Install as a local dependency (Recommended)");
    println!("   This will install the CLI with all its dependencies in your project:");
    
    // Check which package managers are available
    let mut available_managers = Vec::new();
    
    if Command::new("npm").arg("--version").output().is_ok() {
        available_managers.push("npm install @0xshariq/package-installer");
    }
    if Command::new("yarn").arg("--version").output().is_ok() {
        available_managers.push("yarn add @0xshariq/package-installer");
    }
    if Command::new("pnpm").arg("--version").output().is_ok() {
        available_managers.push("pnpm add @0xshariq/package-installer");
    }
    
    if available_managers.is_empty() {
        println!("   ❌ No package manager found! Please install Node.js and npm first:");
        println!("      Visit: https://nodejs.org/en/download/");
    } else {
        for manager in &available_managers {
            println!("   {}", manager);
        }
        println!("   Then run: npx pi [command] or node_modules/.bin/pi [command]");
    }
    
    println!("");
    println!("🔧 OPTION 2: Fix the global installation dependencies");
    println!("   Navigate to the CLI cache directory and install dependencies:");
    println!("   cd {:?}", cache_dir);
    
    for manager in available_managers {
        let install_cmd = manager.replace("@0xshariq/package-installer", "").replace("add", "install").replace("install ", "install --production");
        println!("   {}", install_cmd);
    }
    
    println!("");
    println!("💡 TIP: For better performance and reliability, we recommend using Option 1.");
    println!("   The local installation will always have the correct dependencies.");
    println!("");
    println!("3. After installation, run the CLI command again.");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}
