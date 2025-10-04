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
                if (packageNames.includes(packageJson.name) && fs.existsSync(path.join(currentDir, 'features'))) {
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
    // Method 3: Check current working directory (in case the CLI is run from the project root)
    const cwdPath = process.cwd();
    const workspacePackage = path.join(cwdPath, 'package.json');
    if (fs.existsSync(workspacePackage) && fs.existsSync(path.join(cwdPath, 'features'))) {
        try {
            const packageJson = JSON.parse(fs.readFileSync(workspacePackage, 'utf-8'));
            if (packageNames.includes(packageJson.name)) {
                return cwdPath;
            }
        }
        catch (error) {
            // Continue to other methods
        }
    }
    // Method 4: Try to resolve using require.resolve for npm installations
    for (const packageName of packageNames) {
        try {
            const packageMainPath = require.resolve(`${packageName}/package.json`);
            const resolvedRoot = path.dirname(packageMainPath);
            if (fs.existsSync(path.join(resolvedRoot, 'features'))) {
                return resolvedRoot;
            }
        }
        catch (error) {
            // Package not found in require cache, try next
        }
    }
    // Method 5: Check common global installation paths for all package managers
    const globalPaths = [];
    const homeDir = process.env.HOME || process.env.USERPROFILE || '';
    // npm global paths
    globalPaths.push(
    // Linux/macOS npm global paths
    '/usr/local/lib/node_modules/@0xshariq/package-installer', '/usr/lib/node_modules/@0xshariq/package-installer', 
    // User-specific npm global paths
    path.join(homeDir, '.npm-global/lib/node_modules/@0xshariq/package-installer'), path.join(homeDir, '.npm/lib/node_modules/@0xshariq/package-installer'), 
    // Windows npm global paths
    path.join(process.env.APPDATA || '', 'npm/node_modules/@0xshariq/package-installer'), path.join(process.env.ProgramFiles || '', 'nodejs/node_modules/@0xshariq/package-installer'));
    // Check all global paths
    for (const globalPath of globalPaths) {
        if (fs.existsSync(globalPath) && fs.existsSync(path.join(globalPath, 'features'))) {
            return globalPath;
        }
    }
    // Method 6: Check if npm prefix is available and use it (for npm installations)
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
    // Method 7: Check relative to script location as last resort
    const scriptRelativePath = path.resolve(__dirname, '../../');
    if (fs.existsSync(path.join(scriptRelativePath, 'features'))) {
        return scriptRelativePath;
    }
    // Final fallback: use the local development path but warn user
    console.warn('⚠️  Could not resolve CLI root path, using fallback. Some features may not work correctly.');
    console.warn('💡 Try running with npx for better compatibility: npx @0xshariq/package-installer');
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
