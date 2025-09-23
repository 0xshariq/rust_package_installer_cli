/**
 * Path resolution utility for Package Installer CLI
 * Centralized path resolution logic that works for both local development and global installations
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
/**
 * Get the CLI installation root directory
 * Works for both local development and global installations across multiple package managers
 */
export function getCliRootPath() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // All possible package names across different package managers
    const packageNames = [
        '@0xshariq/package-installer', // npm
        'package-installer-cli', // PyPI, RubyGems, Rust crates
        'go_package_installer_cli' // Go (from github.com/0xshariq/go_package_installer_cli)
    ];
    // Method 1: Walk up the directory tree to find package.json with any of our package names
    let currentDir = __dirname;
    while (currentDir !== path.dirname(currentDir)) {
        const packageJsonPath = path.join(currentDir, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            try {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
                if (packageNames.includes(packageJson.name)) {
                    return currentDir;
                }
            }
            catch (error) {
                // Continue searching
            }
        }
        currentDir = path.dirname(currentDir);
    }
    // Method 2: Check if this is a local development environment
    const localDevPath = path.resolve(__dirname, '..', '..');
    if (fs.existsSync(path.join(localDevPath, 'package.json')) &&
        fs.existsSync(path.join(localDevPath, 'features'))) {
        try {
            const packageJson = JSON.parse(fs.readFileSync(path.join(localDevPath, 'package.json'), 'utf-8'));
            if (packageNames.includes(packageJson.name)) {
                return localDevPath;
            }
        }
        catch (error) {
            // Continue to other methods
        }
    }
    // Method 3: Try to resolve using require.resolve for npm installations
    for (const packageName of packageNames) {
        try {
            const packageMainPath = require.resolve(`${packageName}/package.json`);
            return path.dirname(packageMainPath);
        }
        catch (error) {
            // Package not found in require cache, try next
        }
    }
    // Method 4: Check common global installation paths for all package managers
    const globalPaths = [];
    // npm global paths
    globalPaths.push(
    // Linux/macOS npm global paths
    '/usr/local/lib/node_modules/@0xshariq/package-installer', '/usr/lib/node_modules/@0xshariq/package-installer', 
    // User-specific npm global paths
    path.join(process.env.HOME || '', '.npm-global/lib/node_modules/@0xshariq/package-installer'), path.join(process.env.HOME || '', '.npm/lib/node_modules/@0xshariq/package-installer'), 
    // Windows npm global paths
    path.join(process.env.APPDATA || '', 'npm/node_modules/@0xshariq/package-installer'), path.join(process.env.ProgramFiles || '', 'nodejs/node_modules/@0xshariq/package-installer'));
    // PyPI/pip global paths
    if (process.env.HOME) {
        globalPaths.push(
        // Linux/macOS pip user install paths
        path.join(process.env.HOME, '.local/lib/python*/site-packages/package-installer-cli'), path.join(process.env.HOME, '.local/bin/package-installer-cli'), 
        // System-wide pip install paths
        '/usr/local/lib/python*/site-packages/package-installer-cli', '/usr/lib/python*/site-packages/package-installer-cli');
    }
    // RubyGems global paths
    if (process.env.HOME) {
        globalPaths.push(
        // User gem installation paths
        path.join(process.env.HOME, '.gem/ruby/*/gems/package-installer-cli-*'), path.join(process.env.HOME, '.local/share/gem/ruby/*/gems/package-installer-cli-*'), 
        // System gem installation paths
        '/usr/local/lib/ruby/gems/*/gems/package-installer-cli-*', '/var/lib/gems/*/gems/package-installer-cli-*');
    }
    // Rust cargo global paths
    if (process.env.HOME) {
        globalPaths.push(path.join(process.env.HOME, '.cargo/bin/package-installer-cli'), path.join(process.env.HOME, '.cargo/registry/src/*/package-installer-cli-*'));
    }
    // Go global paths
    const goPath = process.env.GOPATH || path.join(process.env.HOME || '', 'go');
    globalPaths.push(path.join(goPath, 'bin/go_package_installer_cli'), path.join(goPath, 'bin/pi'), // In case the binary is named 'pi'
    path.join(goPath, 'pkg/mod/github.com/0xshariq/go_package_installer_cli*'), 
    // Also check system-wide go installation paths
    '/usr/local/bin/go_package_installer_cli', '/usr/local/bin/pi');
    // Check all possible global paths
    for (const globalPath of globalPaths) {
        // Handle wildcard paths
        if (globalPath.includes('*')) {
            try {
                const { execSync } = require('child_process');
                const expandedPaths = execSync(`ls -d ${globalPath} 2>/dev/null || true`, { encoding: 'utf8' }).trim().split('\n').filter((p) => p);
                for (const expandedPath of expandedPaths) {
                    if (fs.existsSync(expandedPath) && (fs.existsSync(path.join(expandedPath, 'features')) ||
                        fs.existsSync(path.join(path.dirname(expandedPath), 'features')))) {
                        return fs.existsSync(path.join(expandedPath, 'features')) ? expandedPath : path.dirname(expandedPath);
                    }
                }
            }
            catch (error) {
                // Continue to next path
            }
        }
        else {
            if (fs.existsSync(globalPath) && fs.existsSync(path.join(globalPath, 'features'))) {
                return globalPath;
            }
        }
    }
    // Method 5: Check if npm prefix is available and use it (for npm installations)
    try {
        const { execSync } = require('child_process');
        const npmPrefix = execSync('npm config get prefix', { encoding: 'utf8' }).trim();
        const npmGlobalPath = path.join(npmPrefix, 'lib/node_modules/@0xshariq/package-installer');
        if (fs.existsSync(npmGlobalPath) && fs.existsSync(path.join(npmGlobalPath, 'features'))) {
            return npmGlobalPath;
        }
    }
    catch (error) {
        // npm not available or command failed
    }
    // Method 6: Check binary location and work backwards (for compiled languages like Go/Rust)
    try {
        const { execSync } = require('child_process');
        const whichResult = execSync('which pi || which package-installer-cli || which go_package_installer_cli || echo ""', { encoding: 'utf8' }).trim();
        if (whichResult) {
            // Go up from binary location to find the package root
            let binaryDir = path.dirname(whichResult);
            while (binaryDir !== path.dirname(binaryDir)) {
                if (fs.existsSync(path.join(binaryDir, 'features'))) {
                    return binaryDir;
                }
                binaryDir = path.dirname(binaryDir);
            }
        }
    }
    catch (error) {
        // which command failed or not available
    }
    // Final fallback: use the local development path
    console.warn('⚠️  Could not resolve CLI root path, using fallback');
    return path.resolve(__dirname, '..', '..');
}
/**
 * Get the path to the features directory
 */
export function getFeaturesPath() {
    return path.join(getCliRootPath(), 'features');
}
/**
 * Get the path to the features.json file
 */
export function getFeaturesJsonPath() {
    return path.join(getFeaturesPath(), 'features.json');
}
/**
 * Get the path to the templates directory
 */
export function getTemplatesPath() {
    return path.join(getCliRootPath(), 'templates');
}
/**
 * Get the path to the package.json file
 */
export function getPackageJsonPath() {
    return path.join(getCliRootPath(), 'package.json');
}
