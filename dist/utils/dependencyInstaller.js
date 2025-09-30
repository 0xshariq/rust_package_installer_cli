/**
 * Enhanced Multi-language dependency installer utility for Package Installer CLI v3.2.0
 * Supports Node.js, Python, Rust, Go, Ruby, and more with intelligent package management
 */
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { ENHANCED_LANGUAGE_CONFIGS, getLanguageConfig, detectLanguageFromFiles, getPreferredPackageManager, getAllConfigFiles } from './languageConfig.js';
const execAsync = promisify(exec);
// Enhanced dependency installers with modern package managers
export const LANGUAGE_INSTALLERS = Object.fromEntries(Object.entries(ENHANCED_LANGUAGE_CONFIGS).map(([lang, config]) => [
    lang,
    config.packageManagers.map(pm => ({
        name: pm.name,
        command: pm.installCommand,
        configFiles: pm.configFiles,
        detectCommand: pm.detectCommand,
        priority: pm.priority,
        features: pm.features.map(f => f.name)
    }))
]));
/**
 * Enhanced project file discovery with better filtering and performance
 */
async function findProjectFiles(projectPath, maxDepth = 3) {
    const foundFiles = [];
    const foundDirectories = [];
    const detectedLanguages = new Set();
    const detectedPackageManagers = new Set();
    // Skip directories that are known to be non-essential
    const skipDirectories = new Set([
        'node_modules', '.git', 'dist', 'build', '.next', '.nuxt', 'coverage',
        '.vscode', '.idea', '__pycache__', '.pytest_cache', 'target', 'vendor',
        '.gradle', '.mvn', 'bin', 'obj', '.vs', 'logs', 'tmp', 'temp'
    ]);
    async function searchDirectory(currentPath, currentDepth) {
        if (currentDepth > maxDepth)
            return;
        try {
            const entries = await fs.readdir(currentPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);
                if (entry.isDirectory()) {
                    if (!skipDirectories.has(entry.name) && !entry.name.startsWith('.')) {
                        foundDirectories.push(fullPath);
                        await searchDirectory(fullPath, currentDepth + 1);
                    }
                }
                else if (entry.isFile()) {
                    // Check against all language config files
                    const allConfigFiles = getAllConfigFiles();
                    if (allConfigFiles.includes(entry.name) || entry.name.includes('.lock')) {
                        foundFiles.push(fullPath);
                        // Detect language and package manager
                        const languages = detectLanguageFromFiles([entry.name]);
                        languages.forEach(lang => {
                            detectedLanguages.add(lang.language);
                            const config = getLanguageConfig(lang.language);
                            if (config) {
                                config.packageManagers.forEach(pm => {
                                    if (pm.lockFiles.includes(entry.name) || pm.configFiles.includes(entry.name)) {
                                        detectedPackageManagers.add(pm.name);
                                    }
                                });
                            }
                        });
                    }
                }
            }
        }
        catch (error) {
            console.warn(chalk.yellow(`⚠️  Could not scan directory: ${currentPath}`));
        }
    }
    await searchDirectory(projectPath, 0);
    return {
        files: foundFiles,
        directories: foundDirectories,
        languages: Array.from(detectedLanguages),
        packageManagers: Array.from(detectedPackageManagers)
    };
}
/**
 * Enhanced dependency installation with better progress tracking and error handling
 */
export async function installProjectDependencies(projectPath, projectName = 'project', installMcpServer = false, progressCallback) {
    const results = [];
    const startTime = Date.now();
    try {
        progressCallback?.({
            step: 'discovery',
            progress: 0,
            message: 'Discovering project structure...'
        });
        const { files, languages, packageManagers } = await findProjectFiles(projectPath);
        if (files.length === 0) {
            console.log(chalk.hex('#95afc0')('📦 No configuration files found - skipping dependency installation'));
            return results;
        }
        console.log(chalk.hex('#00d2d3')(`🔍 Discovered project structure:`));
        console.log(chalk.hex('#95afc0')(`   Languages: ${languages.join(', ') || 'None detected'}`));
        console.log(chalk.hex('#95afc0')(`   Package Managers: ${packageManagers.join(', ') || 'None detected'}`));
        console.log(chalk.hex('#95afc0')(`   Config Files: ${files.length}`));
        let currentProgress = 20;
        const progressIncrement = 70 / languages.length;
        // Install dependencies for each detected language
        for (const language of languages) {
            try {
                progressCallback?.({
                    step: 'installation',
                    progress: currentProgress,
                    message: `Installing ${language} dependencies...`
                });
                const result = await installLanguageDependencies(projectPath, language, {
                    timeout: 300000, // 5 minutes per language
                    retries: 2
                });
                results.push(result);
                currentProgress += progressIncrement;
            }
            catch (error) {
                console.warn(chalk.yellow(`⚠️  Failed to install ${language} dependencies: ${error.message}`));
                results.push({
                    success: false,
                    packages: [],
                    language,
                    packageManager: 'unknown',
                    duration: 0,
                    errors: [error.message]
                });
            }
        }
        // Install MCP server if requested and this is a Node.js project
        if (installMcpServer && languages.includes('javascript')) {
            try {
                progressCallback?.({
                    step: 'mcp',
                    progress: 90,
                    message: 'Installing MCP server tools...'
                });
                await installMcpServerAndInitializeGit(projectPath, languages.includes('javascript'));
            }
            catch (error) {
                console.warn(chalk.yellow('⚠️  Could not install MCP server tools'));
            }
        }
        else if (!languages.includes('javascript')) {
            // For non-JavaScript projects, just initialize git with regular commands
            try {
                await initializeGitWithRegularCommands(projectPath);
            }
            catch (error) {
                console.warn(chalk.yellow('⚠️  Could not initialize git repository'));
            }
        }
        progressCallback?.({
            step: 'complete',
            progress: 100,
            message: 'Dependency installation completed!'
        });
        const totalDuration = Date.now() - startTime;
        console.log(chalk.green(`✅ Dependency installation completed in ${(totalDuration / 1000).toFixed(2)}s`));
        return results;
    }
    catch (error) {
        console.error(chalk.red(`❌ Dependency installation failed: ${error.message}`));
        throw error;
    }
}
/**
 * Install dependencies for a specific language with enhanced error handling
 */
async function installLanguageDependencies(projectPath, language, options = {}) {
    const startTime = Date.now();
    const config = getLanguageConfig(language);
    const preferredPackageManager = getPreferredPackageManager(language);
    if (!preferredPackageManager) {
        const errorResult = {
            success: false,
            packages: [],
            language,
            packageManager: 'unknown',
            duration: Date.now() - startTime,
            errors: [`No package manager found for language: ${language}`],
            warnings: []
        };
        return errorResult;
    }
    const spinner = ora(chalk.hex('#9c88ff')(`Installing ${language} dependencies with ${preferredPackageManager.name}...`)).start();
    try {
        // Check if package manager is available
        try {
            await execAsync(preferredPackageManager.detectCommand || `${preferredPackageManager.name} --version`);
        }
        catch (error) {
            spinner.warn(chalk.yellow(`${preferredPackageManager.name} not found, trying alternatives...`));
            const config = getLanguageConfig(language);
            if (config) {
                // Try fallback package managers
                for (const pm of config.packageManagers.slice(1)) {
                    try {
                        await execAsync(pm.detectCommand || `${pm.name} --version`);
                        spinner.text = chalk.hex('#9c88ff')(`Installing ${language} dependencies with ${pm.name}...`);
                        break;
                    }
                    catch {
                        continue;
                    }
                }
            }
        }
        // Execute installation command with timeout and retries
        const installCommand = preferredPackageManager.installCommand;
        let commandOutput = '';
        let lastError = null;
        const maxRetries = options.retries || 2;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                if (attempt > 0) {
                    spinner.text = chalk.hex('#ffa502')(`Retry ${attempt}/${maxRetries} - Installing ${language} dependencies...`);
                }
                const { stdout, stderr } = await execAsync(installCommand, {
                    cwd: projectPath,
                    timeout: options.timeout || 300000, // 5 minutes default
                    maxBuffer: 1024 * 1024 * 10 // 10MB buffer
                });
                const duration = Date.now() - startTime;
                spinner.succeed(chalk.green(`✅ ${language} dependencies installed successfully (${(duration / 1000).toFixed(2)}s)`));
                return {
                    success: true,
                    packages: extractInstalledPackages(stdout, language),
                    language,
                    packageManager: preferredPackageManager.name,
                    duration,
                    logs: [stdout]
                };
            }
            catch (error) {
                lastError = error;
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
                }
            }
        }
        if (lastError) {
            throw lastError;
        }
    }
    catch (error) {
        const duration = Date.now() - startTime;
        spinner.fail(chalk.red(`❌ Failed to install ${language} dependencies`));
        // Provide helpful error messages and suggestions
        if (error.code === 'ENOENT') {
            console.log(chalk.yellow(`💡 ${preferredPackageManager.name} not found. Install it first:`));
            console.log(chalk.hex('#95afc0')(getInstallInstructions(preferredPackageManager.name)));
        }
        else if (error.message.includes('timeout')) {
            console.log(chalk.yellow('💡 Installation timed out. Try running manually:'));
            console.log(chalk.hex('#95afc0')(`   cd ${path.basename(projectPath)}`));
            console.log(chalk.hex('#95afc0')(`   ${preferredPackageManager.installCommand}`));
        }
        return {
            success: false,
            packages: [],
            language,
            packageManager: preferredPackageManager.name,
            duration,
            errors: [error.message],
            warnings: []
        };
    }
    // Default return in case all above logic fails (should not happen, but for type safety)
    return {
        success: false,
        packages: [],
        language,
        packageManager: preferredPackageManager ? preferredPackageManager.name : 'unknown',
        duration: Date.now() - startTime,
        errors: ['Unknown error occurred during dependency installation'],
        warnings: []
    };
}
/**
 * Extract installed package names from installation output
 */
function extractInstalledPackages(output, language) {
    const packages = [];
    try {
        switch (language) {
            case 'javascript':
            case 'typescript':
                // Parse npm/yarn/pnpm/bun output
                const jsMatches = output.match(/(?:added|installed)\s+(.+?)(?:\s|$)/gi);
                if (jsMatches) {
                    jsMatches.forEach(match => {
                        const pkg = match.replace(/(?:added|installed)\s+/i, '').trim();
                        if (pkg)
                            packages.push(pkg);
                    });
                }
                break;
            case 'python':
                // Parse pip/poetry output
                const pyMatches = output.match(/Successfully installed (.+)/i);
                if (pyMatches) {
                    packages.push(...pyMatches[1].split(' ').filter(pkg => pkg.trim()));
                }
                break;
            case 'rust':
                // Parse cargo output
                const rustMatches = output.match(/Installed package `(.+?)` /gi);
                if (rustMatches) {
                    rustMatches.forEach(match => {
                        const pkg = match.match(/`(.+?)`/)?.[1];
                        if (pkg)
                            packages.push(pkg);
                    });
                }
                break;
            case 'go':
                // Parse go mod output
                const goMatches = output.match(/go: downloading (.+?) (.+)/gi);
                if (goMatches) {
                    goMatches.forEach(match => {
                        const pkg = match.replace(/go: downloading\s+/, '').split(' ')[0];
                        if (pkg)
                            packages.push(pkg);
                    });
                }
                break;
            case 'ruby':
                // Parse bundler output
                const rubyMatches = output.match(/Installing (.+?) \(/gi);
                if (rubyMatches) {
                    rubyMatches.forEach(match => {
                        const pkg = match.replace(/Installing\s+/, '').replace(/\s+\(.*/, '');
                        if (pkg)
                            packages.push(pkg);
                    });
                }
                break;
            default:
                // Generic extraction
                packages.push('dependencies');
        }
    }
    catch (error) {
        console.warn('Could not extract package names from output');
    }
    return packages;
}
/**
 * Get installation instructions for package managers
 */
function getInstallInstructions(packageManager) {
    const instructions = {
        'pnpm': 'npm install -g pnpm',
        'yarn': 'npm install -g yarn',
        'bun': 'curl -fsSL https://bun.sh/install | bash',
        'poetry': 'curl -sSL https://install.python-poetry.org | python3 -',
        'cargo': 'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh',
        'composer': 'Visit https://getcomposer.org/download/',
        'go': 'Visit https://golang.org/dl/',
        'maven': 'Visit https://maven.apache.org/install.html',
        'bundler': 'gem install bundler',
        'dotnet': 'Visit https://dotnet.microsoft.com/download'
    };
    return instructions[packageManager] || `Install ${packageManager} from official documentation`;
}
/**
 * Enhanced package installation with better options handling
 */
export async function installPackages(projectPath, language, packages, options = {}) {
    if (!packages || packages.length === 0) {
        return;
    }
    const { isDev = false, exact = false, optional = false, timeout = 120000 } = options;
    const packageManager = getPreferredPackageManager(language);
    if (!packageManager) {
        throw new Error(`No package manager found for language: ${language}`);
    }
    let command = '';
    switch (language) {
        case 'javascript':
        case 'typescript':
            const flags = [
                isDev ? (packageManager.name === 'npm' ? '--save-dev' : packageManager.name === 'yarn' ? '--dev' : '--save-dev') : '',
                exact ? '--save-exact' : '',
                optional ? '--save-optional' : ''
            ].filter(Boolean).join(' ');
            command = `${packageManager.name} ${packageManager.name === 'npm' ? 'install' : 'add'} ${flags} ${packages.join(' ')}`;
            break;
        case 'rust':
            const cargoFlags = isDev ? '--dev' : '';
            command = `cargo add ${cargoFlags} ${packages.join(' ')}`;
            break;
        case 'python':
            if (packageManager.name === 'poetry') {
                command = `poetry add ${isDev ? '--group dev' : ''} ${packages.join(' ')}`;
            }
            else {
                command = `pip install ${packages.join(' ')}`;
            }
            break;
        case 'go':
            command = `go get ${packages.join(' ')}`;
            break;
        case 'ruby':
            command = `bundle add ${packages.join(' ')}`;
            break;
        default:
            throw new Error(`Unsupported language: ${language}`);
    }
    const spinner = ora(chalk.hex('#f39c12')(`Installing ${packages.join(', ')} for ${language}...`)).start();
    try {
        await execAsync(command, {
            cwd: projectPath,
            timeout
        });
        spinner.succeed(chalk.green(`✅ Installed ${packages.join(', ')} for ${language}`));
    }
    catch (error) {
        spinner.fail(chalk.red(`❌ Failed to install ${packages.join(', ')} for ${language}: ${error.message}`));
        throw error;
    }
}
/**
 * Install MCP server and initialize git with MCP commands for JavaScript projects
 */
async function installMcpServerAndInitializeGit(projectPath, isJavaScript) {
    const spinner = ora(chalk.hex('#9c88ff')('Installing @0xshariq/github-mcp-server...')).start();
    try {
        // Install the MCP server globally
        await execAsync('npm install -g @0xshariq/github-mcp-server', {
            cwd: projectPath,
            timeout: 120000 // 2 minutes timeout
        });
        spinner.text = chalk.hex('#9c88ff')('Initializing git repository with MCP commands...');
        // Try MCP commands first
        try {
            await execAsync('ginit', { cwd: projectPath });
            await execAsync('gadd', { cwd: projectPath });
            await execAsync('gcommit "Initial Commit From Package Installer CLI"', { cwd: projectPath });
            spinner.succeed(chalk.green('✅ MCP server installed and git initialized with MCP commands'));
        }
        catch (mcpError) {
            // If MCP commands fail, fallback to regular git commands
            spinner.text = chalk.hex('#ffa502')('MCP commands failed, using regular git commands...');
            await initializeGitWithRegularCommands(projectPath);
            spinner.succeed(chalk.green('✅ MCP server installed and git initialized with regular commands'));
        }
    }
    catch (error) {
        spinner.fail(chalk.red('❌ Failed to install MCP server'));
        console.log(chalk.yellow('💡 Falling back to regular git initialization...'));
        await initializeGitWithRegularCommands(projectPath);
    }
}
/**
 * Initialize git repository with regular git commands for non-JavaScript projects
 */
async function initializeGitWithRegularCommands(projectPath) {
    const spinner = ora(chalk.hex('#f39c12')('Initializing git repository...')).start();
    try {
        // Check if git is already initialized
        const gitExists = await fs.pathExists(path.join(projectPath, '.git'));
        if (!gitExists) {
            await execAsync('git init', { cwd: projectPath });
            spinner.text = chalk.hex('#f39c12')('Adding files to git...');
            await execAsync('git add .', { cwd: projectPath });
            spinner.text = chalk.hex('#f39c12')('Creating initial commit...');
            await execAsync('git commit -m "Initial Commit From Package Installer CLI"', { cwd: projectPath });
            spinner.succeed(chalk.green('✅ Git repository initialized successfully'));
        }
        else {
            spinner.succeed(chalk.green('✅ Git repository already exists'));
        }
    }
    catch (error) {
        spinner.fail(chalk.red(`❌ Failed to initialize git repository: ${error.message}`));
        throw error;
    }
}
