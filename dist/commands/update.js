/**
 * Update Command - Project Dependency Updater for Package Installer CLI
 * Updates project dependencies for JavaScript, Python, Rust, Go, Ruby, and PHP projects
 */
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import boxen from 'boxen';
import gradient from 'gradient-string';
import { displayErrorMessage } from '../utils/dashboard.js';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);
/**
 * Main update command - Updates project dependencies only
 */
export async function updateCommand(options) {
    // Handle help option
    if (options.help) {
        showUpdateHelp();
        return;
    }
    // Display banner
    console.clear();
    const banner = boxen(gradient(['#4facfe', '#00f2fe'])('🔄 Package Installer CLI - Dependency Updater') + '\n\n' +
        chalk.white('Update your project dependencies to the latest versions'), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan'
    });
    console.log(banner);
    try {
        const projectPath = process.cwd();
        // Check if we're in a valid project directory
        const projectType = await detectProjectType(projectPath);
        if (!projectType) {
            console.log(chalk.yellow('⚠️  No supported project detected in current directory'));
            console.log(chalk.gray('Supported project types:'));
            console.log(chalk.gray('  • JavaScript/TypeScript (package.json)'));
            console.log(chalk.gray('  • Python (requirements.txt, pyproject.toml)'));
            console.log(chalk.gray('  • Rust (Cargo.toml)'));
            console.log(chalk.gray('  • Go (go.mod)'));
            console.log(chalk.gray('  • Ruby (Gemfile)'));
            console.log(chalk.gray('  • PHP (composer.json)'));
            return;
        }
        console.log(chalk.blue(`🔍 Detected project type: ${chalk.cyan(projectType)}`));
        await updateProjectDependencies(projectPath, projectType, options);
    }
    catch (error) {
        displayErrorMessage('Dependency update failed', ['An error occurred during the update process', String(error)]);
    }
}
/**
 * Detect project type based on configuration files
 */
async function detectProjectType(projectPath) {
    const projectTypes = [
        { file: 'package.json', type: 'JavaScript/TypeScript' },
        { file: 'requirements.txt', type: 'Python' },
        { file: 'pyproject.toml', type: 'Python' },
        { file: 'Cargo.toml', type: 'Rust' },
        { file: 'go.mod', type: 'Go' },
        { file: 'Gemfile', type: 'Ruby' },
        { file: 'composer.json', type: 'PHP' }
    ];
    for (const { file, type } of projectTypes) {
        if (await fs.pathExists(path.join(projectPath, file))) {
            return type;
        }
    }
    return null;
}
/**
 * Update project dependencies based on detected type
 */
async function updateProjectDependencies(projectPath, projectType, options) {
    console.log(chalk.blue(`\n📦 Updating ${projectType} dependencies...`));
    switch (projectType) {
        case 'JavaScript/TypeScript':
            await updateNodejsDependencies(projectPath, options);
            break;
        case 'Python':
            await updatePythonDependencies(projectPath, options);
            break;
        case 'Rust':
            await updateRustDependencies(projectPath, options);
            break;
        case 'Go':
            await updateGoDependencies(projectPath, options);
            break;
        case 'Ruby':
            await updateRubyDependencies(projectPath, options);
            break;
        case 'PHP':
            await updatePhpDependencies(projectPath, options);
            break;
        default:
            throw new Error(`Unsupported project type: ${projectType}`);
    }
}
/**
 * Update Node.js/TypeScript dependencies
 */
async function updateNodejsDependencies(projectPath, options) {
    const spinner = ora('Detecting package manager...').start();
    // Detect package manager
    let packageManager = 'npm';
    if (await fs.pathExists(path.join(projectPath, 'pnpm-lock.yaml'))) {
        packageManager = 'pnpm';
    }
    else if (await fs.pathExists(path.join(projectPath, 'yarn.lock'))) {
        packageManager = 'yarn';
    }
    spinner.text = `Updating dependencies with ${packageManager}...`;
    try {
        let updateCommand = '';
        switch (packageManager) {
            case 'pnpm':
                updateCommand = options.latest ? 'pnpm update --latest' : 'pnpm update';
                break;
            case 'yarn':
                updateCommand = options.latest ? 'yarn upgrade --latest' : 'yarn upgrade';
                break;
            case 'npm':
                updateCommand = 'npm update';
                if (options.latest)
                    updateCommand += ' --save';
                break;
        }
        const { stdout, stderr } = await execAsync(updateCommand, { cwd: projectPath });
        spinner.succeed(chalk.green(`✅ Dependencies updated successfully with ${packageManager}`));
        if (stdout) {
            console.log(chalk.gray('\nUpdate details:'));
            console.log(chalk.gray(stdout));
        }
        if (stderr) {
            console.log(chalk.yellow('\nWarnings:'));
            console.log(chalk.yellow(stderr));
        }
    }
    catch (error) {
        spinner.fail(chalk.red('❌ Failed to update Node.js dependencies'));
        throw new Error(`Package manager error: ${error.message}`);
    }
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
    console.clear();
    const helpContent = boxen(gradient(['#4facfe', '#00f2fe'])('🔄 Package Installer CLI - Update Command Help') + '\n\n' +
        chalk.white('Update project dependencies to their latest versions') + '\n\n' +
        chalk.cyan('Usage:') + '\n' +
        chalk.white('  pi update [options]') + '\n' +
        chalk.white('  pi u [options]') + chalk.gray(' (alias)') + '\n\n' +
        chalk.cyan('Description:') + '\n' +
        chalk.white('  Updates project dependencies using the appropriate package manager.') + '\n' +
        chalk.white('  Automatically detects project type and package manager.') + '\n\n' +
        chalk.cyan('Options:') + '\n' +
        chalk.white('  -h, --help') + chalk.gray('                 Show this help message') + '\n' +
        chalk.white('  --latest') + chalk.gray('                   Update to latest versions (breaking changes possible)') + '\n\n' +
        chalk.cyan('Supported Project Types:') + '\n' +
        chalk.green('  📦 JavaScript/TypeScript') + chalk.gray('   npm, yarn, pnpm') + '\n' +
        chalk.green('  🐍 Python') + chalk.gray('                pip, poetry') + '\n' +
        chalk.green('  🦀 Rust') + chalk.gray('                  cargo') + '\n' +
        chalk.green('  🐹 Go') + chalk.gray('                    go mod') + '\n' +
        chalk.green('  💎 Ruby') + chalk.gray('                  bundler') + '\n' +
        chalk.green('  🐘 PHP') + chalk.gray('                   composer') + '\n\n' +
        chalk.cyan('Examples:') + '\n' +
        chalk.gray('  # Update dependencies in current project') + '\n' +
        chalk.white('  pi update') + '\n\n' +
        chalk.gray('  # Update to latest versions (potentially breaking)') + '\n' +
        chalk.white('  pi update --latest') + '\n\n' +
        chalk.gray('  # Show help') + '\n' +
        chalk.white('  pi update --help') + '\n\n' +
        chalk.yellow('⚠️  Note: Always backup your project before major updates') + '\n' +
        chalk.gray('For CLI updates, use: ') + chalk.cyan('pi upgrade-cli'), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan'
    });
    console.log(helpContent);
}
