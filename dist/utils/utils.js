/**
 * Enhanced utility functions for Package Installer CLI v3.0.0
 * Comprehensive utilities for project management, validation, and operations
 */
import chalk from 'chalk';
import path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { promisify } from 'util';
import { exec } from 'child_process';
const execAsync = promisify(exec);
/**
 * Enhanced string utilities
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export function camelCase(str) {
    return str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
}
export function kebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
export function snakeCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[-\s]+/g, '_')
        .toLowerCase();
}
export function titleCase(str) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
/**
 * Enhanced path utilities with cross-platform support
 */
export function normalizePath(inputPath) {
    return path.normalize(inputPath).replace(/\\/g, '/');
}
export function resolveAbsolutePath(inputPath, basePath) {
    if (path.isAbsolute(inputPath)) {
        return normalizePath(inputPath);
    }
    const base = basePath || process.cwd();
    return normalizePath(path.resolve(base, inputPath));
}
export function getRelativePath(from, to) {
    return normalizePath(path.relative(from, to));
}
export function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
/**
 * Enhanced framework theme utilities with more styling options
 */
export function getFrameworkTheme(framework) {
    const themes = {
        react: chalk.cyanBright,
        reactjs: chalk.cyanBright,
        nextjs: chalk.whiteBright.bgBlack,
        vue: chalk.greenBright,
        vuejs: chalk.greenBright,
        angular: chalk.redBright,
        angularjs: chalk.redBright,
        express: chalk.greenBright,
        expressjs: chalk.greenBright,
        remix: chalk.blueBright,
        remixjs: chalk.blueBright,
        nestjs: chalk.magentaBright,
        rust: chalk.yellowBright,
        svelte: chalk.hex('#ff6600'),
        sveltekit: chalk.hex('#ff6600'),
        solid: chalk.blue,
        solidjs: chalk.blue,
        qwik: chalk.magenta,
        astro: chalk.magenta,
        default: chalk.blueBright
    };
    return themes[framework.toLowerCase()] || themes.default;
}
export function getLanguageIcon(language) {
    const icons = {
        javascript: '🟨',
        typescript: '🔷',
        python: '🐍',
        rust: '🦀',
        go: '🐹',
        java: '☕',
        csharp: '💜',
        php: '🐘',
        ruby: '💎',
        swift: '🍎',
        dart: '🎯'
    };
    return icons[language.toLowerCase()] || '📄';
}
export function getFrameworkIcon(framework) {
    const icons = {
        react: '⚛️',
        reactjs: '⚛️',
        nextjs: '▲',
        vue: '💚',
        vuejs: '💚',
        angular: '🅰️',
        angularjs: '🅰️',
        express: '🚂',
        expressjs: '🚂',
        nestjs: '🏗️',
        rust: '🦀',
        svelte: '🔥',
        sveltekit: '🔥',
        solid: '🧊',
        solidjs: '🧊',
        qwik: '⚡',
        astro: '🚀'
    };
    return icons[framework.toLowerCase()] || '📦';
}
/**
 * Enhanced project name validation with comprehensive checks
 */
export function validateProjectName(name) {
    const errors = [];
    const warnings = [];
    // Basic validation
    if (!name || name.trim().length === 0) {
        errors.push('Project name cannot be empty');
        return { isValid: false, errors, warnings };
    }
    const trimmedName = name.trim();
    // Length validation
    if (trimmedName.length < 2) {
        errors.push('Project name must be at least 2 characters long');
    }
    if (trimmedName.length > 214) {
        errors.push('Project name cannot exceed 214 characters (npm package name limit)');
    }
    // Character validation
    const validNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!validNameRegex.test(trimmedName)) {
        errors.push('Project name may only include letters, numbers, underscores, dashes, and dots');
    }
    // Cannot start with dot or hyphen
    if (trimmedName.startsWith('.') || trimmedName.startsWith('-')) {
        errors.push('Project name cannot start with a dot or hyphen');
    }
    // Cannot end with dot
    if (trimmedName.endsWith('.')) {
        errors.push('Project name cannot end with a dot');
    }
    // Reserved names validation
    const reservedNames = [
        'node_modules', 'package.json', 'package-lock.json', 'pnpm-lock.yaml',
        'yarn.lock', 'readme', 'license', 'changelog', 'src', 'dist', 'build',
        'public', 'static', 'assets', 'components', 'pages', 'api', 'lib',
        'utils', 'types', 'config', 'docs', 'test', 'tests', '__tests__'
    ];
    if (reservedNames.includes(trimmedName.toLowerCase())) {
        errors.push(`"${trimmedName}" is a reserved name and cannot be used`);
    }
    // Scoped package names (starting with @)
    if (trimmedName.startsWith('@')) {
        warnings.push('Scoped package names require proper npm configuration');
    }
    // Common naming conventions warnings
    if (trimmedName.includes(' ')) {
        warnings.push('Consider using hyphens or underscores instead of spaces');
    }
    if (/[A-Z]/.test(trimmedName)) {
        warnings.push('Consider using lowercase for better compatibility');
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        value: trimmedName
    };
}
/**
 * Enhanced framework and template utilities
 */
export function frameworkSupportsDatabase(frameworkConfig) {
    return frameworkConfig &&
        frameworkConfig.databases &&
        Object.keys(frameworkConfig.databases).length > 0;
}
export function getAvailableDatabases(frameworkConfig) {
    if (!frameworkSupportsDatabase(frameworkConfig)) {
        return [];
    }
    return Object.keys(frameworkConfig.databases || {});
}
export function getAvailableOrms(frameworkConfig, database, language) {
    if (!frameworkSupportsDatabase(frameworkConfig)) {
        return [];
    }
    const databaseConfig = frameworkConfig.databases?.[database];
    if (!databaseConfig || !databaseConfig[language]) {
        return [];
    }
    return databaseConfig[language].orms || [];
}
export function isCombinationTemplate(framework) {
    return framework.includes('+');
}
export function getFrameworkDirectoryName(framework) {
    return framework.replace(/\+/g, '-');
}
/**
 * Enhanced template metadata utilities
 */
export function extractTemplateMetadata(templatePath) {
    try {
        const packageJsonPath = path.join(templatePath, 'package.json');
        const readmePath = path.join(templatePath, 'README.md');
        let packageJson = {};
        let readmeContent = '';
        if (fs.existsSync(packageJsonPath)) {
            packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        }
        if (fs.existsSync(readmePath)) {
            readmeContent = fs.readFileSync(readmePath, 'utf-8');
        }
        return {
            name: packageJson.name || path.basename(templatePath),
            framework: detectFrameworks(packageJson.dependencies || {})[0] || 'unknown',
            language: detectLanguages(templatePath)[0] || 'javascript',
            bundler: packageJson.bundler || undefined,
            ui: packageJson.ui || undefined,
            features: packageJson.keywords || [],
            hasSrc: fs.existsSync(path.join(templatePath, 'src')),
            hasTailwind: Boolean(packageJson.dependencies?.tailwindcss || packageJson.devDependencies?.tailwindcss),
            createdAt: new Date().toISOString(),
            size: 0 // Could calculate actual directory size if needed
        };
    }
    catch (error) {
        console.warn(`Failed to extract template metadata from ${templatePath}:`, error);
        return null;
    }
}
function extractDescriptionFromReadme(readmeContent) {
    const lines = readmeContent.split('\n');
    for (const line of lines) {
        if (line.trim() && !line.startsWith('#') && !line.startsWith('!')) {
            return line.trim().slice(0, 100);
        }
    }
    return 'No description available';
}
function detectFrameworks(dependencies) {
    const frameworks = [];
    const frameworkDetection = {
        'react': ['react'],
        'nextjs': ['next'],
        'vue': ['vue'],
        'angular': ['@angular/core'],
        'express': ['express'],
        'nestjs': ['@nestjs/core'],
        'svelte': ['svelte'],
        'solid-js': ['solid-js'],
        'qwik': ['@builder.io/qwik'],
        'astro': ['astro']
    };
    for (const [framework, deps] of Object.entries(frameworkDetection)) {
        if (deps.some(dep => dependencies[dep])) {
            frameworks.push(framework);
        }
    }
    return frameworks;
}
function detectLanguages(templatePath) {
    const languages = new Set();
    try {
        // Check for TypeScript
        if (fs.existsSync(path.join(templatePath, 'tsconfig.json')) ||
            fs.existsSync(path.join(templatePath, 'tsconfig.app.json'))) {
            languages.add('typescript');
        }
        // Check for JavaScript (default if no TS)
        if (languages.size === 0 ||
            fs.existsSync(path.join(templatePath, 'jsconfig.json'))) {
            languages.add('javascript');
        }
        // Check for Rust
        if (fs.existsSync(path.join(templatePath, 'Cargo.toml'))) {
            languages.add('rust');
        }
        // Check for Python
        if (fs.existsSync(path.join(templatePath, 'requirements.txt')) ||
            fs.existsSync(path.join(templatePath, 'pyproject.toml'))) {
            languages.add('python');
        }
        // Check for Go
        if (fs.existsSync(path.join(templatePath, 'go.mod'))) {
            languages.add('go');
        }
    }
    catch (error) {
        console.warn('Error detecting languages:', error);
    }
    return Array.from(languages);
}
/**
 * Feature management utilities
 */
export function validateFeatureConfig(feature) {
    const errors = [];
    const warnings = [];
    if (!feature.description || feature.description.trim().length === 0) {
        errors.push('Feature description is required');
    }
    if (!feature.supportedFrameworks || !Array.isArray(feature.supportedFrameworks) || feature.supportedFrameworks.length === 0) {
        errors.push('Feature must support at least one framework');
    }
    if (!feature.supportedLanguages || !Array.isArray(feature.supportedLanguages) || feature.supportedLanguages.length === 0) {
        errors.push('Feature must support at least one language');
    }
    // Validate files structure
    if (!feature.files || typeof feature.files !== 'object') {
        errors.push('Feature must have a files configuration object');
    }
    else {
        // Validate the nested structure of files
        Object.keys(feature.files).forEach(provider => {
            const providerFiles = feature.files[provider];
            if (!providerFiles || typeof providerFiles !== 'object') {
                errors.push(`Provider ${provider} must have a valid files configuration`);
            }
        });
    }
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        value: feature
    };
}
export function mergeFeatureFiles(baseFiles, featureFiles) {
    const merged = new Set([...baseFiles]);
    featureFiles.forEach(file => merged.add(file));
    return Array.from(merged);
}
/**
 * File system utilities
 */
export async function copyFileWithBackup(source, destination) {
    if (fs.existsSync(destination)) {
        const backup = `${destination}.backup.${Date.now()}`;
        fs.copyFileSync(destination, backup);
    }
    fs.copyFileSync(source, destination);
}
export function generateFileHash(filePath) {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
}
export async function isDirectoryEmpty(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return true;
    }
    const files = fs.readdirSync(dirPath);
    return files.length === 0 || files.every(file => file.startsWith('.'));
}
/**
 * System utilities
 */
export async function checkSystemRequirements() {
    const checks = {
        node: false,
        npm: false,
        pnpm: false,
        yarn: false,
        git: false,
        rust: false,
        python: false
    };
    const commands = {
        node: 'node --version',
        npm: 'npm --version',
        pnpm: 'pnpm --version',
        yarn: 'yarn --version',
        git: 'git --version',
        rust: 'rustc --version',
        python: 'python --version'
    };
    for (const [tool, command] of Object.entries(commands)) {
        try {
            await execAsync(command);
            checks[tool] = true;
        }
        catch {
            checks[tool] = false;
        }
    }
    return checks;
}
export async function detectPackageManager(projectPath) {
    const lockFiles = {
        'pnpm-lock.yaml': 'pnpm',
        'yarn.lock': 'yarn',
        'package-lock.json': 'npm'
    };
    for (const [lockFile, manager] of Object.entries(lockFiles)) {
        if (fs.existsSync(path.join(projectPath, lockFile))) {
            return manager;
        }
    }
    // Check if pnpm is available globally
    try {
        await execAsync('pnpm --version');
        return 'pnpm';
    }
    catch {
        // Fall back to npm
        return 'npm';
    }
}
/**
 * Enhanced project name utilities
 */
export async function getProjectName(providedName) {
    if (providedName) {
        const validation = validateProjectName(providedName);
        if (!validation.isValid) {
            throw new Error(`Invalid project name: ${validation.errors.join(', ')}`);
        }
        return validation.value;
    }
    const { default: inquirer } = await import('inquirer');
    let projectName = '';
    let isValid = false;
    while (!isValid) {
        const { name } = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is your project name?',
                default: 'my-awesome-app',
                validate: (input) => {
                    const validation = validateProjectName(input);
                    if (!validation.isValid) {
                        return validation.errors[0];
                    }
                    if (validation.warnings.length > 0) {
                        console.log(chalk.yellow('⚠️  ' + validation.warnings.join(', ')));
                    }
                    return true;
                }
            }
        ]);
        const validation = validateProjectName(name);
        if (validation.isValid) {
            projectName = validation.value;
            isValid = true;
        }
    }
    return projectName;
}
/**
 * Utility for safe JSON parsing
 */
export function safeJsonParse(jsonString, fallback) {
    try {
        return JSON.parse(jsonString);
    }
    catch {
        return fallback;
    }
}
/**
 * Utility for formatting file sizes
 */
export function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}
/**
 * Utility for generating random IDs
 */
export function generateId(length = 8) {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}
/**
 * Utility for deep merging objects
 */
export function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && target[key] && typeof target[key] === 'object') {
            result[key] = deepMerge(target[key], source[key]);
        }
        else if (source[key] !== undefined) {
            result[key] = source[key];
        }
    }
    return result;
}
/**
 * Utility for retry logic
 */
export async function retry(fn, maxAttempts = 3, delay = 1000) {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt === maxAttempts) {
                throw lastError;
            }
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
    }
    throw lastError;
}
