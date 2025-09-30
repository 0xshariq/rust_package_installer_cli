/**
 * Update Command - Advanced Project Dependency Updater for Package Installer CLI
 * Updates specific packages or all dependencies for JavaScript, TypeScript, Python, Rust, Go, and Ruby projects
 * Features: Breaking change detection, specific package updates, bulk updates
 */
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import boxen from 'boxen';
import gradient from 'gradient-string';
import inquirer from 'inquirer';
import semver from 'semver';
import https from 'https';
import { createStandardHelp } from '../utils/helpFormatter.js';
import { displayErrorMessage } from '../utils/dashboard.js';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
/**
 * Main update command - Updates specific packages or all project dependencies
 * Supports: pi update, pi update package1, pi update package1,package2,package3
 */
export async function updateCommand(packages, options = {}) {
    // Handle help option
    if (options.help || packages === '--help' || packages === '-h') {
        showUpdateHelp();
        return;
    }
    // Display banner
    console.clear();
    const banner = boxen(gradient(['#4facfe', '#00f2fe'])('🔄 Package Installer CLI - Advanced Dependency Updater') + '\n\n' +
        chalk.white('Update specific packages or all dependencies with breaking change detection'), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan'
    });
    console.log(banner);
    try {
        const projectPath = process.cwd();
        // Detect project configuration
        const projectConfig = await detectProjectConfig(projectPath);
        if (!projectConfig) {
            console.log(chalk.yellow('⚠️  No supported project detected in current directory'));
            console.log(chalk.gray('Supported project types:'));
            console.log(chalk.gray('  • JavaScript/TypeScript (package.json)'));
            console.log(chalk.gray('  • Python (requirements.txt, pyproject.toml)'));
            console.log(chalk.gray('  • Rust (Cargo.toml)'));
            console.log(chalk.gray('  • Go (go.mod)'));
            console.log(chalk.gray('  • Ruby (Gemfile)'));
            return;
        }
        console.log(chalk.blue(`🔍 Detected: ${chalk.cyan(projectConfig.type)} project using ${chalk.cyan(projectConfig.packageManager)}`));
        // Parse package names if provided
        const packageList = packages ? packages.split(',').map(pkg => pkg.trim()).filter(Boolean) : [];
        if (packageList.length > 0) {
            console.log(chalk.cyan(`� Updating specific packages: ${packageList.join(', ')}`));
            await updateSpecificPackages(projectPath, projectConfig, packageList, options);
        }
        else {
            console.log(chalk.cyan('📦 Updating all project dependencies'));
            await updateAllDependencies(projectPath, projectConfig, options);
        }
    }
    catch (error) {
        displayErrorMessage('Dependency update failed', ['An error occurred during the update process', String(error)]);
    }
}
/**
 * Detect project configuration including type, package manager, and files
 */
async function detectProjectConfig(projectPath) {
    const projectTypes = [
        {
            file: 'package.json',
            type: 'JavaScript/TypeScript',
            getPackageManager: async () => {
                if (await fs.pathExists(path.join(projectPath, 'pnpm-lock.yaml')))
                    return 'pnpm';
                if (await fs.pathExists(path.join(projectPath, 'yarn.lock')))
                    return 'yarn';
                if (await fs.pathExists(path.join(projectPath, 'bun.lockb')))
                    return 'bun';
                return 'npm';
            },
            dependencyFile: 'package.json'
        },
        {
            file: 'pyproject.toml',
            type: 'Python',
            getPackageManager: async () => 'poetry',
            dependencyFile: 'pyproject.toml'
        },
        {
            file: 'requirements.txt',
            type: 'Python',
            getPackageManager: async () => 'pip',
            dependencyFile: 'requirements.txt'
        },
        {
            file: 'Cargo.toml',
            type: 'Rust',
            getPackageManager: async () => 'cargo',
            dependencyFile: 'Cargo.toml'
        },
        {
            file: 'go.mod',
            type: 'Go',
            getPackageManager: async () => 'go',
            dependencyFile: 'go.mod'
        },
        {
            file: 'Gemfile',
            type: 'Ruby',
            getPackageManager: async () => 'bundle',
            dependencyFile: 'Gemfile'
        }
    ];
    for (const config of projectTypes) {
        if (await fs.pathExists(path.join(projectPath, config.file))) {
            const packageManager = await config.getPackageManager();
            return {
                type: config.type,
                packageManager,
                dependencyFile: config.file
            };
        }
    }
    return null;
}
/**
 * Update specific packages with breaking change detection
 */
async function updateSpecificPackages(projectPath, projectConfig, packageNames, options) {
    console.log(chalk.blue(`\n� Analyzing ${packageNames.length} package(s) for updates...`));
    const packagesInfo = [];
    // Analyze each package
    for (const packageName of packageNames) {
        const info = await analyzePackageUpdate(projectPath, projectConfig, packageName);
        if (info) {
            packagesInfo.push(info);
        }
        else {
            console.log(chalk.yellow(`⚠️  Package '${packageName}' not found in dependencies`));
        }
    }
    if (packagesInfo.length === 0) {
        console.log(chalk.yellow('❌ No valid packages found to update'));
        return;
    }
    // Display update summary
    displayUpdateSummary(packagesInfo);
    // Check for breaking changes
    const hasBreakingChanges = packagesInfo.some(pkg => pkg.hasBreakingChanges);
    if (hasBreakingChanges) {
        console.log(chalk.red('\n⚠️  WARNING: Breaking changes detected!'));
        displayBreakingChanges(packagesInfo.filter(pkg => pkg.hasBreakingChanges));
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to continue with these potentially breaking updates?',
                default: false
            }
        ]);
        if (!confirm) {
            console.log(chalk.yellow('❌ Update cancelled by user'));
            return;
        }
    }
    // Perform updates
    await performPackageUpdates(projectPath, projectConfig, packagesInfo, options);
}
/**
 * Update all dependencies in the project
 */
async function updateAllDependencies(projectPath, projectConfig, options) {
    console.log(chalk.blue('\n🔍 Analyzing all project dependencies...'));
    // Get current dependencies
    const currentDeps = await getCurrentDependencies(projectPath, projectConfig);
    if (Object.keys(currentDeps).length === 0) {
        console.log(chalk.yellow('❌ No dependencies found to update'));
        return;
    }
    const packagesInfo = [];
    const spinner = ora(`Checking ${Object.keys(currentDeps).length} dependencies for updates...`).start();
    // Analyze all packages
    for (const [packageName] of Object.entries(currentDeps)) {
        const info = await analyzePackageUpdate(projectPath, projectConfig, packageName);
        if (info && info.currentVersion !== info.latestVersion) {
            packagesInfo.push(info);
        }
    }
    spinner.succeed(`Found ${packagesInfo.length} packages with available updates`);
    if (packagesInfo.length === 0) {
        console.log(chalk.green('✅ All dependencies are already up to date!'));
        return;
    }
    // Display update summary
    displayUpdateSummary(packagesInfo);
    // Check for breaking changes
    const breakingPackages = packagesInfo.filter(pkg => pkg.hasBreakingChanges);
    if (breakingPackages.length > 0) {
        console.log(chalk.red(`\n⚠️  WARNING: ${breakingPackages.length} package(s) have potential breaking changes!`));
        displayBreakingChanges(breakingPackages);
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to continue with updates that may include breaking changes?',
                default: false
            }
        ]);
        if (!confirm) {
            console.log(chalk.yellow('❌ Update cancelled by user'));
            return;
        }
    }
    // Perform updates
    await performPackageUpdates(projectPath, projectConfig, packagesInfo, options);
}
/**
 * Get current dependencies from project files
 */
async function getCurrentDependencies(projectPath, projectConfig) {
    const dependencies = {};
    try {
        switch (projectConfig.type) {
            case 'JavaScript/TypeScript': {
                const packageJsonPath = path.join(projectPath, 'package.json');
                const packageJson = await fs.readJson(packageJsonPath);
                Object.assign(dependencies, packageJson.dependencies || {});
                Object.assign(dependencies, packageJson.devDependencies || {});
                break;
            }
            case 'Python': {
                if (projectConfig.dependencyFile === 'pyproject.toml') {
                    // Handle Poetry dependencies
                    const tomlPath = path.join(projectPath, 'pyproject.toml');
                    const tomlContent = await fs.readFile(tomlPath, 'utf-8');
                    // Simple TOML parsing for dependencies
                    const depMatch = tomlContent.match(/\[tool\.poetry\.dependencies\]([\s\S]*?)(?=\[|$)/);
                    if (depMatch) {
                        const depSection = depMatch[1];
                        const depLines = depSection.split('\n').filter(line => line.includes('='));
                        for (const line of depLines) {
                            const match = line.match(/^([^=]+)\s*=\s*"([^"]+)"/);
                            if (match && match[1].trim() !== 'python') {
                                dependencies[match[1].trim()] = match[2];
                            }
                        }
                    }
                }
                else {
                    // Handle requirements.txt
                    const reqPath = path.join(projectPath, 'requirements.txt');
                    const reqContent = await fs.readFile(reqPath, 'utf-8');
                    const lines = reqContent.split('\n');
                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (trimmed && !trimmed.startsWith('#')) {
                            const match = trimmed.match(/^([a-zA-Z0-9_-]+)([>=<!~]+)?(.*)?$/);
                            if (match) {
                                dependencies[match[1]] = match[3] || 'latest';
                            }
                        }
                    }
                }
                break;
            }
            case 'Rust': {
                const cargoPath = path.join(projectPath, 'Cargo.toml');
                const cargoContent = await fs.readFile(cargoPath, 'utf-8');
                const depMatch = cargoContent.match(/\[dependencies\]([\s\S]*?)(?=\[|$)/);
                if (depMatch) {
                    const depSection = depMatch[1];
                    const depLines = depSection.split('\n').filter(line => line.includes('='));
                    for (const line of depLines) {
                        const match = line.match(/^([^=]+)\s*=\s*"([^"]+)"/);
                        if (match) {
                            dependencies[match[1].trim()] = match[2];
                        }
                    }
                }
                break;
            }
            case 'Go': {
                const goModPath = path.join(projectPath, 'go.mod');
                const goModContent = await fs.readFile(goModPath, 'utf-8');
                const lines = goModContent.split('\n');
                let inRequire = false;
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed === 'require (') {
                        inRequire = true;
                        continue;
                    }
                    if (trimmed === ')') {
                        inRequire = false;
                        continue;
                    }
                    if (inRequire || trimmed.startsWith('require ')) {
                        const match = trimmed.match(/^(?:require\s+)?([^\s]+)\s+([^\s]+)/);
                        if (match) {
                            dependencies[match[1]] = match[2];
                        }
                    }
                }
                break;
            }
            case 'Ruby': {
                const gemfilePath = path.join(projectPath, 'Gemfile');
                const gemfileContent = await fs.readFile(gemfilePath, 'utf-8');
                const lines = gemfileContent.split('\n');
                for (const line of lines) {
                    const trimmed = line.trim();
                    const match = trimmed.match(/gem\s+['"]([^'"]+)['"](?:\s*,\s*['"]([^'"]+)['"])?/);
                    if (match) {
                        dependencies[match[1]] = match[2] || 'latest';
                    }
                }
                break;
            }
        }
    }
    catch (error) {
        console.warn(chalk.yellow(`⚠️  Could not read dependencies: ${error}`));
    }
    return dependencies;
}
/**
 * Analyze a package for updates and breaking changes
 */
async function analyzePackageUpdate(projectPath, projectConfig, packageName) {
    const currentDeps = await getCurrentDependencies(projectPath, projectConfig);
    const currentVersion = currentDeps[packageName];
    if (!currentVersion) {
        return null;
    }
    let latestVersion = '';
    let breakingChangeDetails = [];
    try {
        // Get latest version based on project type
        switch (projectConfig.type) {
            case 'JavaScript/TypeScript':
                latestVersion = await getLatestNpmVersion(packageName);
                breakingChangeDetails = await getNpmBreakingChanges(packageName, currentVersion, latestVersion);
                break;
            case 'Python':
                latestVersion = await getLatestPyPiVersion(packageName);
                break;
            case 'Rust':
                latestVersion = await getLatestCratesVersion(packageName);
                break;
            case 'Go':
                latestVersion = await getLatestGoVersion(packageName);
                break;
            case 'Ruby':
                latestVersion = await getLatestGemVersion(packageName);
                break;
        }
    }
    catch (error) {
        console.warn(chalk.yellow(`⚠️  Could not fetch latest version for ${packageName}: ${error}`));
        latestVersion = currentVersion;
    }
    const cleanCurrent = semver.clean(currentVersion) || currentVersion;
    const cleanLatest = semver.clean(latestVersion) || latestVersion;
    let updateType = 'unknown';
    let hasBreakingChanges = false;
    if (semver.valid(cleanCurrent) && semver.valid(cleanLatest)) {
        if (semver.major(cleanLatest) > semver.major(cleanCurrent)) {
            updateType = 'major';
            hasBreakingChanges = true;
        }
        else if (semver.minor(cleanLatest) > semver.minor(cleanCurrent)) {
            updateType = 'minor';
        }
        else if (semver.patch(cleanLatest) > semver.patch(cleanCurrent)) {
            updateType = 'patch';
        }
    }
    else if (cleanCurrent !== cleanLatest) {
        hasBreakingChanges = true; // Assume breaking changes for non-semver
    }
    return {
        name: packageName,
        currentVersion: cleanCurrent,
        latestVersion: cleanLatest,
        hasBreakingChanges: hasBreakingChanges || breakingChangeDetails.length > 0,
        breakingChangeDetails,
        updateType,
        language: projectConfig.type
    };
}
/**
 * Get latest version from npm registry
 */
async function getLatestNpmVersion(packageName) {
    return new Promise((resolve, reject) => {
        const url = `https://registry.npmjs.org/${packageName}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed['dist-tags']?.latest || 'unknown');
                }
                catch (error) {
                    reject(new Error(`Failed to parse npm response: ${error}`));
                }
            });
        }).on('error', reject);
    });
}
/**
 * Get breaking changes information from npm package
 */
async function getNpmBreakingChanges(packageName, currentVersion, latestVersion) {
    const changes = [];
    // Check if it's a major version bump (likely breaking)
    const currentMajor = semver.major(semver.clean(currentVersion) || '0.0.0');
    const latestMajor = semver.major(semver.clean(latestVersion) || '0.0.0');
    if (latestMajor > currentMajor) {
        changes.push(`Major version change: ${currentMajor}.x.x → ${latestMajor}.x.x`);
        changes.push('This usually indicates breaking changes. Check the package changelog.');
    }
    return changes;
}
/**
 * Get latest version from PyPI
 */
async function getLatestPyPiVersion(packageName) {
    return new Promise((resolve, reject) => {
        const url = `https://pypi.org/pypi/${packageName}/json`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed.info?.version || 'unknown');
                }
                catch (error) {
                    reject(new Error(`Failed to parse PyPI response: ${error}`));
                }
            });
        }).on('error', reject);
    });
}
/**
 * Get latest version from crates.io
 */
async function getLatestCratesVersion(packageName) {
    return new Promise((resolve, reject) => {
        const url = `https://crates.io/api/v1/crates/${packageName}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed.crate?.newest_version || 'unknown');
                }
                catch (error) {
                    reject(new Error(`Failed to parse crates.io response: ${error}`));
                }
            });
        }).on('error', reject);
    });
}
/**
 * Get latest version from Go proxy
 */
async function getLatestGoVersion(packageName) {
    try {
        const { stdout } = await execAsync(`go list -m -versions ${packageName}`);
        const versions = stdout.trim().split(' ');
        return versions[versions.length - 1] || 'unknown';
    }
    catch (error) {
        return 'unknown';
    }
}
/**
 * Get latest version from RubyGems
 */
async function getLatestGemVersion(packageName) {
    return new Promise((resolve, reject) => {
        const url = `https://rubygems.org/api/v1/gems/${packageName}.json`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed.version || 'unknown');
                }
                catch (error) {
                    reject(new Error(`Failed to parse RubyGems response: ${error}`));
                }
            });
        }).on('error', reject);
    });
}
/**
 * Display update summary with visual formatting
 */
function displayUpdateSummary(updates) {
    if (updates.length === 0) {
        console.log(chalk.green('✅ All packages are up to date!'));
        return;
    }
    console.log(chalk.cyan('\n📦 Package Updates Available:\n'));
    const table = updates.map(pkg => {
        const versionChange = `${pkg.currentVersion} → ${pkg.latestVersion}`;
        const status = pkg.hasBreakingChanges ?
            chalk.yellow('⚠️  Breaking') :
            chalk.green('✅ Safe');
        return [
            chalk.bold(pkg.name),
            versionChange,
            status,
            pkg.language || 'unknown'
        ];
    });
    // Simple table formatting
    console.log('Package'.padEnd(25) + 'Version Change'.padEnd(20) + 'Status'.padEnd(15) + 'Language');
    console.log('─'.repeat(70));
    table.forEach(row => {
        console.log(row[0].padEnd(25) +
            row[1].padEnd(20) +
            row[2].padEnd(15) +
            row[3]);
    });
    console.log();
}
/**
 * Display breaking changes warnings
 */
function displayBreakingChanges(packages) {
    const packagesWithBreaking = packages.filter(pkg => pkg.hasBreakingChanges);
    if (packagesWithBreaking.length === 0)
        return;
    console.log(chalk.red('⚠️  Breaking Changes Detected:\n'));
    packagesWithBreaking.forEach(pkg => {
        console.log(chalk.yellow(`${pkg.name}:`));
        (pkg.breakingChangeDetails || []).forEach(change => {
            console.log(`  • ${change}`);
        });
        console.log();
    });
    console.log(chalk.yellow('Please review these changes before updating!\n'));
}
/**
 * Perform actual package updates
 */
async function performPackageUpdates(projectPath, projectConfig, packages, options) {
    const spinner = ora('Updating packages...').start();
    try {
        for (const pkg of packages) {
            spinner.text = `Updating ${pkg.name}...`;
            switch (pkg.language || projectConfig.type) {
                case 'javascript':
                case 'typescript':
                case 'JavaScript/TypeScript':
                    await updateNpmPackage(projectPath, pkg.name, pkg.latestVersion);
                    break;
                case 'python':
                case 'Python':
                    await updatePythonPackage(projectPath, pkg.name, pkg.latestVersion);
                    break;
                case 'rust':
                case 'Rust':
                    await updateRustPackage(projectPath, pkg.name, pkg.latestVersion);
                    break;
                case 'go':
                case 'Go':
                    await updateGoPackage(projectPath, pkg.name, pkg.latestVersion);
                    break;
                case 'ruby':
                case 'Ruby':
                    await updateRubyPackage(projectPath, pkg.name, pkg.latestVersion);
                    break;
            }
        }
        spinner.succeed(chalk.green('✅ All packages updated successfully!'));
    }
    catch (error) {
        spinner.fail(chalk.red('❌ Failed to update packages'));
        throw error;
    }
}
/**
 * Update individual npm package
 */
async function updateNpmPackage(projectPath, packageName, version) {
    await execAsync(`npm install ${packageName}@${version}`, { cwd: projectPath });
}
/**
 * Update individual Python package
 */
async function updatePythonPackage(projectPath, packageName, version) {
    const hasPoetry = await fs.pathExists(path.join(projectPath, 'pyproject.toml'));
    if (hasPoetry) {
        await execAsync(`poetry add ${packageName}@${version}`, { cwd: projectPath });
    }
    else {
        await execAsync(`pip install ${packageName}==${version}`, { cwd: projectPath });
    }
}
/**
 * Update individual Rust package
 */
async function updateRustPackage(projectPath, packageName, version) {
    await execAsync(`cargo add ${packageName}@${version}`, { cwd: projectPath });
}
/**
 * Update individual Go package
 */
async function updateGoPackage(projectPath, packageName, version) {
    await execAsync(`go get ${packageName}@v${version}`, { cwd: projectPath });
}
/**
 * Update individual Ruby package
 */
async function updateRubyPackage(projectPath, packageName, version) {
    // Update Gemfile and run bundle install
    await execAsync(`bundle add ${packageName} --version ${version}`, { cwd: projectPath });
}
/**
 * Update Python dependencies
 */
async function updatePythonDependencies(projectPath, options) {
    const spinner = ora('Updating Python dependencies...').start();
    try {
        const hasPoetry = await fs.pathExists(path.join(projectPath, 'pyproject.toml')) ||
            await fs.pathExists(path.join(projectPath, 'poetry.lock'));
        if (hasPoetry) {
            // Use Poetry
            await execAsync('poetry update', { cwd: projectPath });
            spinner.succeed(chalk.green('✅ Python dependencies updated with Poetry'));
        }
        else {
            // Use pip with requirements.txt
            const requirementsPath = path.join(projectPath, 'requirements.txt');
            if (await fs.pathExists(requirementsPath)) {
                await execAsync('pip install --upgrade -r requirements.txt', { cwd: projectPath });
                spinner.succeed(chalk.green('✅ Python dependencies updated with pip'));
            }
            else {
                spinner.warn(chalk.yellow('⚠️  No requirements.txt or pyproject.toml found'));
            }
        }
    }
    catch (error) {
        spinner.fail(chalk.red('❌ Failed to update Python dependencies'));
        throw new Error(`Python update error: ${error.message}`);
    }
}
/**
 * Update Rust dependencies
 */
async function updateRustDependencies(projectPath, options) {
    const spinner = ora('Updating Rust dependencies...').start();
    try {
        await execAsync('cargo update', { cwd: projectPath });
        spinner.succeed(chalk.green('✅ Rust dependencies updated with Cargo'));
    }
    catch (error) {
        spinner.fail(chalk.red('❌ Failed to update Rust dependencies'));
        throw new Error(`Cargo update error: ${error.message}`);
    }
}
/**
 * Update Go dependencies
 */
async function updateGoDependencies(projectPath, options) {
    const spinner = ora('Updating Go dependencies...').start();
    try {
        // Update all dependencies to their latest versions
        await execAsync('go get -u ./...', { cwd: projectPath });
        await execAsync('go mod tidy', { cwd: projectPath });
        spinner.succeed(chalk.green('✅ Go dependencies updated'));
    }
    catch (error) {
        spinner.fail(chalk.red('❌ Failed to update Go dependencies'));
        throw new Error(`Go update error: ${error.message}`);
    }
}
/**
 * Update Ruby dependencies
 */
async function updateRubyDependencies(projectPath, options) {
    const spinner = ora('Updating Ruby dependencies...').start();
    try {
        await execAsync('bundle update', { cwd: projectPath });
        spinner.succeed(chalk.green('✅ Ruby dependencies updated with Bundler'));
    }
    catch (error) {
        spinner.fail(chalk.red('❌ Failed to update Ruby dependencies'));
        throw new Error(`Bundle update error: ${error.message}`);
    }
}
/**
 * Update PHP dependencies
 */
async function updatePhpDependencies(projectPath, options) {
    const spinner = ora('Updating PHP dependencies...').start();
    try {
        await execAsync('composer update', { cwd: projectPath });
        spinner.succeed(chalk.green('✅ PHP dependencies updated with Composer'));
    }
    catch (error) {
        spinner.fail(chalk.red('❌ Failed to update PHP dependencies'));
        throw new Error(`Composer update error: ${error.message}`);
    }
}
/**
 * Show detailed help for update command
 */
export function showUpdateHelp() {
    const helpConfig = {
        commandName: 'Update',
        emoji: '🔄',
        description: 'Update project dependencies to their latest versions.\nAutomatically detects project type and package manager.',
        usage: [
            'update [options]',
            'u [options]   # alias'
        ],
        options: [
            { flag: '-h, --help', description: 'Show this help message' },
            { flag: '--latest', description: 'Update to latest versions (breaking changes possible)' }
        ],
        examples: [
            { command: 'update', description: 'Update dependencies in current project' },
            { command: 'update --latest', description: 'Update to latest versions (potentially breaking)' },
            { command: 'u', description: 'Use alias command' }
        ],
        additionalSections: [
            {
                title: 'Supported Project Types',
                items: [
                    '📦 JavaScript/TypeScript - npm, yarn, pnpm',
                    '🐍 Python - pip, poetry',
                    '🦀 Rust - cargo',
                    '🐹 Go - go mod',
                    '💎 Ruby - bundler, gem'
                ]
            }
        ],
        tips: [
            'Always backup your project before major updates',
            'For CLI updates, use: pi upgrade-cli',
            'Use --latest flag with caution as it may introduce breaking changes'
        ]
    };
    createStandardHelp(helpConfig);
}
