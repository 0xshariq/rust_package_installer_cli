/**
 * Doctor command - Diagnose and fix common development issues
 */
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import boxen from 'boxen';
import gradient from 'gradient-string';
import { displaySuccessMessage, displayErrorMessage } from '../utils/dashboard.js';
import { createStandardHelp } from '../utils/helpFormatter.js';
/**
 * Check if command exists
 */
function commandExists(command) {
    try {
        execSync(`which ${command}`, { stdio: 'ignore' });
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Check Node.js and npm installation
 */
async function checkNodeSetup() {
    const issues = [];
    // Check Node.js
    if (!commandExists('node')) {
        issues.push({
            type: 'error',
            category: 'Node.js',
            title: 'Node.js not installed',
            description: 'Node.js is required for JavaScript/TypeScript development',
            solution: 'Install Node.js from https://nodejs.org/',
            autoFixable: false
        });
    }
    else {
        try {
            const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
            const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
            if (majorVersion < 16) {
                issues.push({
                    type: 'warning',
                    category: 'Node.js',
                    title: 'Outdated Node.js version',
                    description: `Node.js ${nodeVersion} is outdated. Recommended: v18 or higher`,
                    solution: 'Update Node.js to the latest LTS version',
                    autoFixable: false
                });
            }
        }
        catch (error) {
            issues.push({
                type: 'error',
                category: 'Node.js',
                title: 'Node.js version check failed',
                description: 'Could not determine Node.js version',
                autoFixable: false
            });
        }
    }
    // Check npm
    if (!commandExists('npm')) {
        issues.push({
            type: 'error',
            category: 'Package Manager',
            title: 'npm not installed',
            description: 'npm is required for package management',
            solution: 'npm is typically installed with Node.js',
            autoFixable: false
        });
    }
    return issues;
}
/**
 * Check project dependencies
 */
async function checkProjectDependencies(projectPath) {
    const issues = [];
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
        issues.push({
            type: 'info',
            category: 'Dependencies',
            title: 'No package.json found',
            description: 'This directory does not appear to be a Node.js project',
            autoFixable: false
        });
        return issues;
    }
    try {
        const packageJson = await fs.readJson(packageJsonPath);
        const nodeModulesPath = path.join(projectPath, 'node_modules');
        // Check if node_modules exists
        if (!await fs.pathExists(nodeModulesPath)) {
            issues.push({
                type: 'warning',
                category: 'Dependencies',
                title: 'Dependencies not installed',
                description: 'node_modules directory is missing',
                solution: 'Run npm install to install dependencies',
                autoFixable: true
            });
        }
        // Check for vulnerabilities (simplified check)
        try {
            const auditResult = execSync('npm audit --json', {
                cwd: projectPath,
                encoding: 'utf8',
                stdio: 'pipe'
            });
            const audit = JSON.parse(auditResult);
            if (audit.metadata && audit.metadata.vulnerabilities) {
                const vulns = audit.metadata.vulnerabilities;
                const totalVulns = Object.values(vulns).reduce((sum, count) => sum + count, 0);
                if (totalVulns > 0) {
                    issues.push({
                        type: 'warning',
                        category: 'Security',
                        title: `${totalVulns} security vulnerabilities found`,
                        description: 'Dependencies have known security vulnerabilities',
                        solution: 'Run npm audit fix to fix automatically, or npm audit for details',
                        autoFixable: true
                    });
                }
            }
        }
        catch (error) {
            // npm audit might fail, but that's okay
        }
    }
    catch (error) {
        issues.push({
            type: 'error',
            category: 'Dependencies',
            title: 'Invalid package.json',
            description: 'Could not parse package.json file',
            solution: 'Fix syntax errors in package.json',
            autoFixable: false
        });
    }
    return issues;
}
/**
 * Auto-fix common issues
 */
async function autoFixIssue(issue, projectPath) {
    const spinner = ora(`Fixing: ${issue.title}`).start();
    try {
        switch (issue.category) {
            case 'Dependencies':
                if (issue.title.includes('not installed')) {
                    execSync('npm install', { cwd: projectPath, stdio: 'ignore' });
                    spinner.succeed(`Fixed: ${issue.title}`);
                    return true;
                }
                break;
            case 'Security':
                if (issue.title.includes('vulnerabilities')) {
                    execSync('npm audit fix', { cwd: projectPath, stdio: 'ignore' });
                    spinner.succeed(`Fixed: ${issue.title}`);
                    return true;
                }
                break;
            default:
                spinner.fail(`Cannot auto-fix: ${issue.title}`);
                return false;
        }
    }
    catch (error) {
        spinner.fail(`Failed to fix: ${issue.title}`);
        return false;
    }
    spinner.fail(`No auto-fix available for: ${issue.title}`);
    return false;
}
/**
 * Display help for doctor command
 */
export function showDoctorHelp() {
    const helpConfig = {
        commandName: 'doctor',
        emoji: '🩺',
        description: 'Diagnose and fix common development issues.\nComprehensive health check for your development environment and project setup.',
        usage: ['pi doctor [options]', 'pi diagnose [options]  # (alias)'],
        options: [
            { flag: '--fix', description: 'Automatically fix detected issues' },
            { flag: '--node', description: 'Check Node.js and npm setup only' },
            { flag: '--deps', description: 'Check project dependencies only' },
            { flag: '--tools', description: 'Check development tools only' },
            { flag: '--verbose', description: 'Show detailed diagnostic information' },
            { flag: '-h, --help', description: 'Show this help message' }
        ],
        examples: [
            { command: 'pi doctor', description: 'Complete health check' },
            { command: 'pi doctor --fix', description: 'Check and auto-fix issues' },
            { command: 'pi doctor --deps', description: 'Check dependencies only' },
            { command: 'pi doctor --node --verbose', description: 'Detailed Node.js check' }
        ],
        tips: [
            'Use --fix to automatically resolve common issues',
            'Run with --verbose for detailed diagnostic information',
            '\'pi diagnose\' is an alias for \'pi doctor\''
        ]
    };
    console.clear();
    createStandardHelp(helpConfig);
}
/**
 * Main doctor command function
 */
export async function doctorCommand(options = {}) {
    if (options.help || options['--help'] || options['-h']) {
        showDoctorHelp();
        return;
    }
    console.clear();
    const banner = boxen(gradient(['#ff6b6b', '#4ecdc4'])('🩺 Development Doctor') + '\n\n' +
        chalk.white('Running comprehensive health checks...'), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green'
    });
    console.log(banner);
    const projectPath = process.cwd();
    try {
        // Handle specific checks
        if (options.node) {
            await performNodeCheck();
            return;
        }
        if (options.deps) {
            await performDependencyCheck(projectPath);
            return;
        }
        if (options.tools) {
            await performToolsCheck();
            return;
        }
        // Run comprehensive diagnostics
        const allIssues = await runComprehensiveDiagnostics(projectPath);
        if (allIssues.length === 0) {
            displaySuccessMessage('Perfect health! 🎉', ['No issues detected in your development environment']);
            return;
        }
        // Display issues
        displayDiagnosticResults(allIssues);
        // Handle auto-fix
        if (options.fix) {
            await performAutoFix(allIssues, projectPath);
        }
        else {
            const autoFixableCount = allIssues.filter(issue => issue.autoFixable).length;
            if (autoFixableCount > 0) {
                console.log(chalk.yellow(`\n💡 ${autoFixableCount} issues can be auto-fixed. Run with --fix to resolve them.`));
            }
        }
    }
    catch (error) {
        displayErrorMessage('Diagnostic failed', ['An error occurred during health check', String(error)]);
    }
}
/**
 * Run comprehensive diagnostics
 */
async function runComprehensiveDiagnostics(projectPath) {
    const spinner = ora('Running health checks...').start();
    const allIssues = [];
    try {
        spinner.text = 'Checking Node.js setup...';
        const nodeIssues = await checkNodeSetup();
        allIssues.push(...nodeIssues);
        spinner.text = 'Checking project dependencies...';
        const depIssues = await checkProjectDependencies(projectPath);
        allIssues.push(...depIssues);
        spinner.text = 'Checking development tools...';
        const toolIssues = await checkDevelopmentTools();
        allIssues.push(...toolIssues);
        spinner.succeed(`Health check completed - ${allIssues.length} issues found`);
    }
    catch (error) {
        spinner.fail('Health check failed');
        throw error;
    }
    return allIssues;
}
/**
 * Perform Node.js specific check
 */
async function performNodeCheck() {
    console.log(chalk.blue('\n🔍 Checking Node.js setup...\n'));
    const issues = await checkNodeSetup();
    if (issues.length === 0) {
        console.log(chalk.green('✅ Node.js setup is healthy'));
    }
    else {
        displayDiagnosticResults(issues);
    }
}
/**
 * Perform dependency specific check
 */
async function performDependencyCheck(projectPath) {
    console.log(chalk.blue('\n🔍 Checking project dependencies...\n'));
    const issues = await checkProjectDependencies(projectPath);
    if (issues.length === 0) {
        console.log(chalk.green('✅ Dependencies are healthy'));
    }
    else {
        displayDiagnosticResults(issues);
    }
}
/**
 * Perform tools specific check
 */
async function performToolsCheck() {
    console.log(chalk.blue('\n🔍 Checking development tools...\n'));
    const issues = await checkDevelopmentTools();
    if (issues.length === 0) {
        console.log(chalk.green('✅ Development tools are healthy'));
    }
    else {
        displayDiagnosticResults(issues);
    }
}
/**
 * Display diagnostic results
 */
function displayDiagnosticResults(issues) {
    const errors = issues.filter(issue => issue.type === 'error');
    const warnings = issues.filter(issue => issue.type === 'warning');
    const info = issues.filter(issue => issue.type === 'info');
    if (errors.length > 0) {
        console.log(chalk.red('\n❌ Errors:'));
        errors.forEach(issue => {
            console.log(chalk.red(`  • ${issue.title}`));
            console.log(chalk.gray(`    ${issue.description}`));
            if (issue.solution) {
                console.log(chalk.blue(`    💡 ${issue.solution}`));
            }
        });
    }
    if (warnings.length > 0) {
        console.log(chalk.yellow('\n⚠️  Warnings:'));
        warnings.forEach(issue => {
            console.log(chalk.yellow(`  • ${issue.title}`));
            console.log(chalk.gray(`    ${issue.description}`));
            if (issue.solution) {
                console.log(chalk.blue(`    💡 ${issue.solution}`));
            }
        });
    }
    if (info.length > 0) {
        console.log(chalk.blue('\nℹ️  Information:'));
        info.forEach(issue => {
            console.log(chalk.blue(`  • ${issue.title}`));
            console.log(chalk.gray(`    ${issue.description}`));
        });
    }
}
/**
 * Perform auto-fix for fixable issues
 */
async function performAutoFix(issues, projectPath) {
    const fixableIssues = issues.filter(issue => issue.autoFixable);
    if (fixableIssues.length === 0) {
        console.log(chalk.yellow('\n⚠️  No auto-fixable issues found'));
        return;
    }
    console.log(chalk.blue(`\n🔧 Attempting to fix ${fixableIssues.length} issues...\n`));
    let fixedCount = 0;
    for (const issue of fixableIssues) {
        const fixed = await autoFixIssue(issue, projectPath);
        if (fixed) {
            fixedCount++;
        }
    }
    if (fixedCount > 0) {
        displaySuccessMessage(`Fixed ${fixedCount} issues!`, ['Your development environment is now healthier']);
    }
}
/**
 * Check development tools
 */
async function checkDevelopmentTools() {
    const issues = [];
    const tools = [
        { command: 'git', name: 'Git', required: true },
        { command: 'code', name: 'VS Code', required: false },
        { command: 'docker', name: 'Docker', required: false }
    ];
    for (const tool of tools) {
        if (!commandExists(tool.command)) {
            issues.push({
                type: tool.required ? 'error' : 'info',
                category: 'Development Tools',
                title: `${tool.name} not installed`,
                description: `${tool.name} is ${tool.required ? 'required' : 'recommended'} for development`,
                solution: `Install ${tool.name}`,
                autoFixable: false
            });
        }
    }
    return issues;
}
/**
 * Run comprehensive diagnostics
 */
async function runDiagnostics(options) {
    const issues = [];
    const projectPath = process.cwd();
    // Check Node.js and npm issues
    if (!options.checkDeps && !options.checkConfig && !options.checkTools) {
        issues.push(...await checkNodejsIssues());
        issues.push(...await checkDependencyIssues(projectPath));
        issues.push(...await checkConfigurationIssues(projectPath));
        issues.push(...await checkToolsIssues());
    }
    else {
        if (options.checkDeps) {
            issues.push(...await checkDependencyIssues(projectPath));
        }
        if (options.checkConfig) {
            issues.push(...await checkConfigurationIssues(projectPath));
        }
        if (options.checkTools) {
            issues.push(...await checkToolsIssues());
        }
    }
    return issues;
}
/**
 * Check Node.js and npm related issues
 */
async function checkNodejsIssues() {
    const issues = [];
    try {
        // Check Node.js version
        const nodeVersion = process.version;
        const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
        if (majorVersion < 16) {
            issues.push({
                type: 'warning',
                category: 'nodejs',
                title: 'Outdated Node.js version',
                description: `Node.js ${nodeVersion} is outdated. Consider upgrading to v18+`,
                fixable: false,
                recommendation: 'Visit https://nodejs.org to download the latest version'
            });
        }
        // Check npm configuration
        try {
            const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
            const npmMajor = parseInt(npmVersion.split('.')[0]);
            if (npmMajor < 8) {
                issues.push({
                    type: 'info',
                    category: 'npm',
                    title: 'Outdated npm version',
                    description: `npm ${npmVersion} could be updated`,
                    fixable: true,
                    fix: 'npm install -g npm@latest'
                });
            }
        }
        catch (error) {
            issues.push({
                type: 'error',
                category: 'npm',
                title: 'npm not available',
                description: 'npm is not installed or not in PATH',
                fixable: false,
                recommendation: 'Reinstall Node.js from https://nodejs.org'
            });
        }
        // Check npm cache issues
        try {
            const cacheInfo = execSync('npm config get cache', { encoding: 'utf8' }).trim();
            if (!await fs.pathExists(cacheInfo)) {
                issues.push({
                    type: 'warning',
                    category: 'npm',
                    title: 'npm cache directory missing',
                    description: 'npm cache directory does not exist',
                    fixable: true,
                    fix: 'npm cache clean --force'
                });
            }
        }
        catch (error) {
            // Ignore cache check errors
        }
    }
    catch (error) {
        issues.push({
            type: 'error',
            category: 'nodejs',
            title: 'Node.js not available',
            description: 'Node.js is not installed or not in PATH',
            fixable: false,
            recommendation: 'Install Node.js from https://nodejs.org'
        });
    }
    return issues;
}
/**
 * Check dependency-related issues
 */
async function checkDependencyIssues(projectPath) {
    const issues = [];
    // Check for package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
        try {
            const packageJson = await fs.readJson(packageJsonPath);
            // Check for missing node_modules
            const nodeModulesPath = path.join(projectPath, 'node_modules');
            if (!await fs.pathExists(nodeModulesPath)) {
                issues.push({
                    type: 'error',
                    category: 'dependencies',
                    title: 'Missing node_modules',
                    description: 'Dependencies are not installed',
                    fixable: true,
                    fix: 'npm install'
                });
            }
            else {
                // Check for outdated lock file
                const lockFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];
                let hasLockFile = false;
                for (const lockFile of lockFiles) {
                    const lockPath = path.join(projectPath, lockFile);
                    if (await fs.pathExists(lockPath)) {
                        hasLockFile = true;
                        // Check if lock file is older than package.json
                        const packageStat = await fs.stat(packageJsonPath);
                        const lockStat = await fs.stat(lockPath);
                        if (lockStat.mtime < packageStat.mtime) {
                            issues.push({
                                type: 'warning',
                                category: 'dependencies',
                                title: 'Outdated lock file',
                                description: `${lockFile} is older than package.json`,
                                fixable: true,
                                fix: 'npm install'
                            });
                        }
                        break;
                    }
                }
                if (!hasLockFile) {
                    issues.push({
                        type: 'info',
                        category: 'dependencies',
                        title: 'No lock file found',
                        description: 'Consider using a lock file for reproducible builds',
                        fixable: true,
                        fix: 'npm install'
                    });
                }
            }
            // Check for security vulnerabilities
            try {
                const auditResult = execSync('npm audit --audit-level moderate', {
                    encoding: 'utf8',
                    stdio: 'pipe'
                });
                if (auditResult.includes('vulnerabilities')) {
                    issues.push({
                        type: 'warning',
                        category: 'security',
                        title: 'Security vulnerabilities detected',
                        description: 'Some dependencies have known security issues',
                        fixable: true,
                        fix: 'npm audit fix'
                    });
                }
            }
            catch (error) {
                if (error.stdout && error.stdout.includes('vulnerabilities')) {
                    issues.push({
                        type: 'warning',
                        category: 'security',
                        title: 'Security vulnerabilities detected',
                        description: 'Some dependencies have known security issues',
                        fixable: true,
                        fix: 'npm audit fix'
                    });
                }
            }
            // Check for duplicate dependencies
            if (packageJson.dependencies && packageJson.devDependencies) {
                const duplicates = Object.keys(packageJson.dependencies)
                    .filter(dep => packageJson.devDependencies[dep]);
                if (duplicates.length > 0) {
                    issues.push({
                        type: 'warning',
                        category: 'dependencies',
                        title: 'Duplicate dependencies',
                        description: `Found in both dependencies and devDependencies: ${duplicates.join(', ')}`,
                        fixable: false,
                        recommendation: 'Remove duplicates from one of the sections'
                    });
                }
            }
        }
        catch (error) {
            issues.push({
                type: 'error',
                category: 'dependencies',
                title: 'Invalid package.json',
                description: 'package.json file is corrupted or invalid',
                fixable: false,
                recommendation: 'Check package.json syntax'
            });
        }
    }
    return issues;
}
/**
 * Check configuration file issues
 */
async function checkConfigurationIssues(projectPath) {
    const issues = [];
    // Check for .gitignore
    const gitignorePath = path.join(projectPath, '.gitignore');
    if (!await fs.pathExists(gitignorePath)) {
        issues.push({
            type: 'info',
            category: 'configuration',
            title: 'Missing .gitignore',
            description: 'No .gitignore file found',
            fixable: true,
            fix: 'create-gitignore'
        });
    }
    else {
        // Check if .gitignore includes node_modules
        const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
        if (!gitignoreContent.includes('node_modules')) {
            issues.push({
                type: 'warning',
                category: 'configuration',
                title: 'Incomplete .gitignore',
                description: '.gitignore should include node_modules',
                fixable: true,
                fix: 'update-gitignore'
            });
        }
    }
    // Check for README.md
    const readmePath = path.join(projectPath, 'README.md');
    if (!await fs.pathExists(readmePath)) {
        issues.push({
            type: 'info',
            category: 'documentation',
            title: 'Missing README.md',
            description: 'No README.md file found',
            fixable: true,
            fix: 'create-readme'
        });
    }
    // Check TypeScript configuration
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');
    if (await fs.pathExists(tsconfigPath)) {
        try {
            const tsconfig = await fs.readJson(tsconfigPath);
            if (!tsconfig.compilerOptions) {
                issues.push({
                    type: 'warning',
                    category: 'configuration',
                    title: 'Invalid TypeScript config',
                    description: 'tsconfig.json missing compilerOptions',
                    fixable: false,
                    recommendation: 'Add compilerOptions to tsconfig.json'
                });
            }
        }
        catch (error) {
            issues.push({
                type: 'error',
                category: 'configuration',
                title: 'Invalid tsconfig.json',
                description: 'TypeScript configuration file is invalid',
                fixable: false,
                recommendation: 'Fix tsconfig.json syntax'
            });
        }
    }
    return issues;
}
/**
 * Check development tools issues
 */
async function checkToolsIssues() {
    const issues = [];
    // Check Git installation and configuration
    try {
        execSync('git --version', { stdio: 'ignore' });
        // Check Git user configuration
        try {
            execSync('git config user.name', { stdio: 'ignore' });
        }
        catch (error) {
            issues.push({
                type: 'warning',
                category: 'git',
                title: 'Git user name not configured',
                description: 'Git user.name is not set',
                fixable: false,
                recommendation: 'Run: git config --global user.name "Your Name"'
            });
        }
        try {
            execSync('git config user.email', { stdio: 'ignore' });
        }
        catch (error) {
            issues.push({
                type: 'warning',
                category: 'git',
                title: 'Git email not configured',
                description: 'Git user.email is not set',
                fixable: false,
                recommendation: 'Run: git config --global user.email "your.email@example.com"'
            });
        }
    }
    catch (error) {
        issues.push({
            type: 'error',
            category: 'git',
            title: 'Git not installed',
            description: 'Git is required for version control',
            fixable: false,
            recommendation: 'Install Git from https://git-scm.com'
        });
    }
    return issues;
}
/**
 * Display detected issues
 */
function displayIssues(issues) {
    const Table = require('cli-table3');
    const table = new Table({
        head: [
            chalk.hex('#00d2d3')('Type'),
            chalk.hex('#10ac84')('Category'),
            chalk.hex('#ffa502')('Issue'),
            chalk.hex('#9c88ff')('Fixable')
        ],
        colWidths: [10, 15, 45, 10],
        style: { head: [], border: ['cyan'] }
    });
    issues.forEach(issue => {
        const typeColor = issue.type === 'error' ? chalk.red :
            issue.type === 'warning' ? chalk.yellow : chalk.blue;
        table.push([
            typeColor(issue.type.toUpperCase()),
            chalk.white(issue.category),
            `${chalk.white(issue.title)}\n${chalk.gray(issue.description)}`,
            issue.fixable ? chalk.green('✓') : chalk.red('✗')
        ]);
    });
    console.log(chalk.hex('#ffa502')('\n🚨 DETECTED ISSUES\n'));
    console.log(table.toString());
    // Show recommendations for non-fixable issues
    const recommendations = issues
        .filter(issue => !issue.fixable && issue.recommendation)
        .map(issue => `${issue.title}: ${issue.recommendation}`);
    if (recommendations.length > 0) {
        console.log(chalk.hex('#00d2d3')('\n💡 MANUAL FIXES REQUIRED:\n'));
        recommendations.forEach((rec, index) => {
            console.log(chalk.gray(`${index + 1}. ${rec}`));
        });
    }
}
/**
 * Attempt to fix issues automatically
 */
async function attemptFixes(issues) {
    const fixableIssues = issues.filter(issue => issue.fixable);
    if (fixableIssues.length === 0) {
        console.log(chalk.yellow('\n⚠️ No automatically fixable issues found'));
        return;
    }
    console.log(chalk.hex('#00d2d3')('\n🔧 ATTEMPTING FIXES...\n'));
    for (const issue of fixableIssues) {
        const spinner = ora(`Fixing: ${issue.title}`).start();
        try {
            await applyFix(issue.fix);
            spinner.succeed(chalk.green(`Fixed: ${issue.title}`));
        }
        catch (error) {
            spinner.fail(chalk.red(`Failed to fix: ${issue.title} - ${error.message}`));
        }
    }
    displaySuccessMessage('Automatic fixes completed!', ['Some issues may require manual intervention']);
}
/**
 * Apply a specific fix
 */
async function applyFix(fixCommand) {
    switch (fixCommand) {
        case 'npm install':
            execSync('npm install', { stdio: 'ignore' });
            break;
        case 'npm install -g npm@latest':
            execSync('npm install -g npm@latest', { stdio: 'ignore' });
            break;
        case 'npm cache clean --force':
            execSync('npm cache clean --force', { stdio: 'ignore' });
            break;
        case 'npm audit fix':
            execSync('npm audit fix', { stdio: 'ignore' });
            break;
        case 'create-gitignore':
            await createBasicGitignore();
            break;
        case 'update-gitignore':
            await updateGitignore();
            break;
        case 'create-readme':
            await createBasicReadme();
            break;
        default:
            throw new Error(`Unknown fix command: ${fixCommand}`);
    }
}
/**
 * Create a basic .gitignore file
 */
async function createBasicGitignore() {
    const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
/dist
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
`;
    await fs.writeFile('.gitignore', gitignoreContent);
}
/**
 * Update existing .gitignore file
 */
async function updateGitignore() {
    let gitignoreContent = await fs.readFile('.gitignore', 'utf-8');
    if (!gitignoreContent.includes('node_modules')) {
        gitignoreContent += '\n# Dependencies\nnode_modules/\n';
    }
    await fs.writeFile('.gitignore', gitignoreContent);
}
/**
 * Create a basic README.md file
 */
async function createBasicReadme() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    let projectName = path.basename(process.cwd());
    if (await fs.pathExists(packageJsonPath)) {
        try {
            const packageJson = await fs.readJson(packageJsonPath);
            projectName = packageJson.name || projectName;
        }
        catch (error) {
            // Use directory name
        }
    }
    const readmeContent = `# ${projectName}

A new project created with Package Installer CLI.

## Installation

\`\`\`bash
npm install
\`\`\`

## Usage

\`\`\`bash
npm start
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## License

MIT
`;
    await fs.writeFile('README.md', readmeContent);
}
