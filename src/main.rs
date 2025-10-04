use std::env;
use std::path::Path;
use std::process::Command;

const LOCAL_CLI_DIR: &str = "node_modules/@0xshariq/package-installer";

fn main() {
    let args: Vec<String> = env::args().collect();
    
    // Check if the binary name contains "package-installer" or "pi" or if first argument is "pi"
    let binary_name = &args[0];
    let should_run_cli = binary_name.contains("package-installer") || 
                        binary_name.contains("pi") || 
                        (args.len() > 1 && args[1] == "pi");
    
    if should_run_cli {
        // Get CLI arguments
        let cli_args = if binary_name.contains("package-installer") || binary_name.contains("pi") {
            args.iter().skip(1).cloned().collect::<Vec<String>>()
        } else {
            args.iter().skip(2).cloned().collect::<Vec<String>>()
        };
        
        // Find and run the CLI
        match find_and_run_cli(&cli_args) {
            Ok(exit_code) => {
                std::process::exit(exit_code);
            }
            Err(e) => {
                println!("❌ Failed to execute the CLI: {}", e);
                print_usage_instructions();
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



fn find_and_run_cli(cli_args: &[String]) -> Result<i32, Box<dyn std::error::Error>> {
    // Try different CLI options in order of preference
    
    // 1. Check for local npm installation
    if let Ok(exit_code) = try_local_installation(cli_args) {
        return Ok(exit_code);
    }
    
    // 2. Try bundled standalone version
    if let Ok(exit_code) = try_bundled_standalone(cli_args) {
        return Ok(exit_code);
    }
    
    // 3. Try bundled executable for current platform
    if let Ok(exit_code) = try_bundled_executable(cli_args) {
        return Ok(exit_code);
    }
    
    Err("No CLI installation found".into())
}

fn try_local_installation(cli_args: &[String]) -> Result<i32, Box<dyn std::error::Error>> {
    let current_dir = env::current_dir()?;
    
    // Check for local npm installations
    let local_paths = vec![
        current_dir.join(LOCAL_CLI_DIR).join("dist").join("index.js"),
        current_dir.join("node_modules").join("@0xshariq").join("package-installer").join("dist").join("index.js"),
        current_dir.join("node_modules").join("package-installer-cli").join("dist").join("index.js"),
    ];
    
    for path in &local_paths {
        if path.exists() {
            println!("✅ Using locally installed CLI from node_modules");
            return run_node_cli(path, cli_args);
        }
    }
    
    // Check parent directories (up to 5 levels)
    let mut check_dir = current_dir.as_path();
    for _ in 0..5 {
        for local_path in &[
            "node_modules/@0xshariq/package-installer/dist/index.js",
            "node_modules/package-installer-cli/dist/index.js",
        ] {
            let full_path = check_dir.join(local_path);
            if full_path.exists() {
                println!("✅ Using locally installed CLI from node_modules");
                return run_node_cli(&full_path, cli_args);
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

fn try_bundled_standalone(cli_args: &[String]) -> Result<i32, Box<dyn std::error::Error>> {
    // Get the directory where this binary is located
    let exe_path = env::current_exe()?;
    let exe_dir = exe_path.parent().ok_or("Cannot determine executable directory")?;
    
    // Check for bundled pkg-ready version first (more compatible)
    let pkg_ready_path = exe_dir.join("bundle").join("pkg-ready").join("index.js");
    if pkg_ready_path.exists() {
        println!("✅ Using bundled pkg-ready CLI");
        if let Ok(exit_code) = run_node_esm_cli(&pkg_ready_path, cli_args) {
            return Ok(exit_code);
        }
    }
    
    // Check for bundled standalone version
    let standalone_path = exe_dir.join("bundle").join("standalone").join("index.js");
    if standalone_path.exists() {
        println!("✅ Using bundled standalone CLI");
        if let Ok(exit_code) = run_node_esm_cli(&standalone_path, cli_args) {
            return Ok(exit_code);
        }
    }
    
    // Also check in the current working directory (for development)
    let current_dir = env::current_dir()?;
    
    let pkg_ready_dev_path = current_dir.join("bundle").join("pkg-ready").join("index.js");
    if pkg_ready_dev_path.exists() {
        println!("✅ Using bundled pkg-ready CLI (development)");
        if let Ok(exit_code) = run_node_esm_cli(&pkg_ready_dev_path, cli_args) {
            return Ok(exit_code);
        }
    }
    
    let standalone_dev_path = current_dir.join("bundle").join("standalone").join("index.js");
    if standalone_dev_path.exists() {
        println!("✅ Using bundled standalone CLI (development)");
        if let Ok(exit_code) = run_node_esm_cli(&standalone_dev_path, cli_args) {
            return Ok(exit_code);
        }
    }
    
    Err("Bundled standalone CLI not found or failed to run".into())
}

fn try_bundled_executable(cli_args: &[String]) -> Result<i32, Box<dyn std::error::Error>> {
    // Get the directory where this binary is located
    let exe_path = env::current_exe()?;
    let exe_dir = exe_path.parent().ok_or("Cannot determine executable directory")?;
    
    // Determine the executable name based on the platform
    let exe_name = if cfg!(target_os = "windows") {
        "package-installer-win.exe"
    } else if cfg!(target_os = "macos") {
        "package-installer-macos"
    } else {
        "package-installer-linux"
    };
    
    // Check for bundled executable relative to the binary
    let bundled_exe_path = exe_dir.join("bundle").join("executables").join(exe_name);
    
    if bundled_exe_path.exists() {
        println!("✅ Using bundled native executable");
        if let Ok(exit_code) = run_native_cli(&bundled_exe_path, cli_args) {
            return Ok(exit_code);
        }
    }
    
    // Also check in the current working directory (for development)
    let current_dir = env::current_dir()?;
    let bundled_exe_dev_path = current_dir.join("bundle").join("executables").join(exe_name);
    
    if bundled_exe_dev_path.exists() {
        println!("✅ Using bundled native executable (development)");
        if let Ok(exit_code) = run_native_cli(&bundled_exe_dev_path, cli_args) {
            return Ok(exit_code);
        }
    }
    
    Err("Bundled executable not found or failed to run".into())
}

fn run_node_cli(cli_path: &Path, cli_args: &[String]) -> Result<i32, Box<dyn std::error::Error>> {
    let status = Command::new("node")
        .arg(cli_path)
        .args(cli_args)
        .status()
        .map_err(|e| format!("Failed to run Node.js CLI. Make sure Node.js is installed: {}", e))?;
    
    Ok(status.code().unwrap_or(1))
}

fn run_node_esm_cli(cli_path: &Path, cli_args: &[String]) -> Result<i32, Box<dyn std::error::Error>> {
    // Just try running it normally - the bundled files should handle ESM/CommonJS internally
    let status = Command::new("node")
        .arg(cli_path)
        .args(cli_args)
        .status()
        .map_err(|e| format!("Failed to run Node.js CLI: {}", e))?;
    
    if status.success() {
        Ok(0)
    } else {
        Err(format!("CLI exited with non-zero status: {}", status.code().unwrap_or(1)).into())
    }
}

fn run_native_cli(exe_path: &Path, cli_args: &[String]) -> Result<i32, Box<dyn std::error::Error>> {
    let status = Command::new(exe_path)
        .args(cli_args)
        .status()
        .map_err(|e| format!("Failed to run native executable: {}", e))?;
    
    Ok(status.code().unwrap_or(1))
}



fn print_usage_instructions() {
    println!("\n📋 CLI NOT FOUND:");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    println!("The Package Installer CLI was not found. Here are your options:");
    println!("");
    
    println!("🌍 OPTION 1: Install locally via npm (Recommended)");
    println!("   npm install @0xshariq/package-installer");
    println!("   npx pi create my-app");
    println!("");
    
    println!("🔧 OPTION 2: Use the bundled version");
    println!("   Make sure the 'bundle/' directory is available alongside this executable");
    println!("   The bundle should contain either:");
    println!("   - bundle/standalone/index.js (Node.js required)");
    println!("   - bundle/executables/package-installer-[platform] (native executable)");
    println!("");
    
    println!("� REQUIREMENTS:");
    if cfg!(target_os = "windows") {
        println!("   - For Node.js version: Install Node.js from https://nodejs.org");
        println!("   - For native executable: No additional requirements");
    } else {
        println!("   - For Node.js version: Install Node.js (recommended)");  
        println!("   - For native executable: No additional requirements");
    }
    
    println!("");
    println!("� More info: https://github.com/0xshariq/rust_package_installer_cli");
    println!("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}
