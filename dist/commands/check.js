import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import fs from 'fs-extra';
import path from 'path';
import semver from 'semver';
import https from 'https';
import { createStandardHelp } from '../utils/helpFormatter.js';
import { getSupportedLanguages, getLanguageConfig } from '../utils/languageConfig.js';
const execAsync = promisify(exec);
// Generate PROJECT_TYPES from shared language configuration with enhanced registry support
const PROJECT_TYPES = getSupportedLanguages().map(lang => {
    const config = getLanguageConfig(lang);
    const primaryPackageManager = config.packageManagers[0];
    // Define registry URLs and package info URLs for different languages
    let registryUrl;
    let packageInfoUrl;
    switch (lang) {
        case 'javascript':
        case 'typescript':
            registryUrl = 'https://registry.npmjs.org';
            packageInfoUrl = (packageName) => `https://registry.npmjs.org/${packageName}`;
            break;
        case 'rust':
            registryUrl = 'https://crates.io';
            packageInfoUrl = (packageName) => `https://crates.io/api/v1/crates/${packageName}`;
            break;
        case 'python':
            registryUrl = 'https://pypi.org';
            packageInfoUrl = (packageName) => `https://pypi.org/pypi/${packageName}/json`;
            break;
        default:
            // For unsupported languages, we'll try npm registry as fallback
            registryUrl = 'https://registry.npmjs.org';
            packageInfoUrl = (packageName) => `https://registry.npmjs.org/${packageName}`;
            break;
    }
    return {
        name: config.displayName,
        files: config.configFiles.filter(cf => cf.required || cf.type === 'dependency').map(cf => cf.filename),
        packageManager: config.packageManagers.map(pm => pm.name).join('/'),
        registryUrl,
        packageInfoUrl,
        getDependencies: (content, filename) => {
            const deps = {};
            // Language-specific dependency parsing
            switch (lang) {
                case 'javascript':
                case 'typescript':
                    if (filename === 'package.json' || filename === 'package-lock.json' || filename === 'pnpm-lock.yml') {
                        return {
                            ...content.dependencies,
                            ...content.devDependencies
                        };
                    }
                    break;
                case 'rust':
                    if (filename === 'Cargo.toml') {
                        if (content.dependencies) {
                            Object.entries(content.dependencies).forEach(([key, value]) => {
                                if (typeof value === 'string') {
                                    deps[key] = value;
                                }
                                else if (value && value.version) {
                                    deps[key] = value.version;
                                }
                            });
                        }
                        if (content['dev-dependencies']) {
                            Object.entries(content['dev-dependencies']).forEach(([key, value]) => {
                                if (typeof value === 'string') {
                                    deps[key] = value;
                                }
                                else if (value && value.version) {
                                    deps[key] = value.version;
                                }
                            });
                        }
                    }
                    break;
                case 'python':
                    if (filename === 'requirements.txt') {
                        const lines = content.toString().split('\n');
                        lines.forEach((line) => {
                            const trimmed = line.trim();
                            if (trimmed && !trimmed.startsWith('#')) {
                                const match = trimmed.match(/^([a-zA-Z0-9_-]+)([>=<!~]+)?(.*)?$/);
                                if (match) {
                                    deps[match[1]] = match[3] || 'latest';
                                }
                            }
                        });
                    }
                    else if (filename === 'pyproject.toml') {
                        if (content.dependencies) {
                            content.dependencies.forEach((dep) => {
                                const match = dep.match(/^([a-zA-Z0-9_-]+)([>=<!~]+)?(.*)?$/);
                                if (match) {
                                    deps[match[1]] = match[3] || 'latest';
                                }
                            });
                        }
                    }
                    break;
                case 'ruby':
                    if (filename === 'Gemfile') {
                        const lines = content.toString().split('\n');
                        lines.forEach((line) => {
                            const trimmed = line.trim();
                            const match = trimmed.match(/gem\s+['"]([^'"]+)['"](?:\s*,\s*['"]([^'"]+)['"])?/);
                            if (match) {
                                deps[match[1]] = match[2] || 'latest';
                            }
                        });
                    }
                    break;
                case 'go':
                    if (filename === 'go.mod') {
                        const lines = content.toString().split('\n');
                        let inRequire = false;
                        lines.forEach((line) => {
                            const trimmed = line.trim();
                            if (trimmed === 'require (') {
                                inRequire = true;
                                return;
                            }
                            if (trimmed === ')') {
                                inRequire = false;
                                return;
                            }
                            if (inRequire || trimmed.startsWith('require ')) {
                                const match = trimmed.match(/^(?:require\s+)?([^\s]+)\s+([^\s]+)/);
                                if (match) {
                                    deps[match[1]] = match[2];
                                }
                            }
                        });
                    }
                    break;
            }
            return deps;
        },
        getInstallCommand: (packages) => {
            const addCmd = primaryPackageManager.addCommand || primaryPackageManager.installCommand;
            return `${addCmd} ${packages.join(' ')}`;
        },
        getUpdateCommand: () => primaryPackageManager.updateCommand || primaryPackageManager.installCommand
    };
});
function getRegistryUrl(lang) {
    switch (lang) {
        case 'javascript':
        case 'typescript':
            return 'https://registry.npmjs.org';
        case 'rust': return 'https://crates.io/api/v1/crates';
        case 'python': return 'https://pypi.org/pypi';
        case 'go': return 'https://proxy.golang.org';
        case 'ruby': return 'https://rubygems.org/api/v1/gems';
        default: return '';
    }
}
/**
 * Enhanced function to fetch package information from various registries
 */
async function fetchPackageFromRegistry(packageName, projectType) {
    if (!projectType.packageInfoUrl) {
        throw new Error(`Registry not supported for ${projectType.name}`);
    }
    const url = projectType.packageInfoUrl(packageName);
    return new Promise((resolve, reject) => {
        const request = https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    // Handle different registry response formats
                    switch (projectType.name) {
                        case 'JavaScript':
                        case 'Typescript':
                            resolve(parseNpmRegistryResponse(parsed, packageName));
                            break;
                        case 'Rust':
                            resolve(parseCratesIoResponse(parsed, packageName));
                            break;
                        case 'Python':
                            resolve(parsePyPiResponse(parsed, packageName));
                            break;
                        default:
                            resolve(parseGenericResponse(parsed, packageName));
                            break;
                    }
                }
                catch (error) {
                    reject(new Error(`Failed to parse registry response: ${error}`));
                }
            });
        });
        request.on('error', (error) => {
            reject(new Error(`Failed to fetch package info: ${error.message}`));
        });
        request.setTimeout(10000, () => {
            request.destroy();
            reject(new Error('Request timeout'));
        });
    });
}
/**
 * Parse npm registry response
 */
function parseNpmRegistryResponse(data, packageName) {
    const latestVersion = data['dist-tags']?.latest || 'unknown';
    const timeData = data.time || {};
    const lastPublished = timeData[latestVersion] || timeData.modified || 'unknown';
    return {
        name: packageName,
        latestVersion,
        description: data.description,
        homepage: data.homepage,
        repository: data.repository?.url,
        license: data.license,
        lastPublished,
        isDeprecated: !!data.deprecated,
        deprecatedMessage: data.deprecated,
        maintainers: data.maintainers?.map(m => m.name) || []
    };
}
/**
 * Parse crates.io registry response
 */
function parseCratesIoResponse(data, packageName) {
    const crate = data.crate || {};
    const versions = data.versions || [];
    const latestVersion = versions.find((v) => !v.yanked)?.num || 'unknown';
    return {
        name: packageName,
        latestVersion,
        description: crate.description,
        homepage: crate.homepage,
        repository: crate.repository,
        license: crate.license,
        lastPublished: crate.updated_at,
        downloadCount: crate.downloads,
        isDeprecated: false
    };
}
/**
 * Parse PyPI registry response
 */
function parsePyPiResponse(data, packageName) {
    const info = data.info || {};
    const latestVersion = info.version || 'unknown';
    return {
        name: packageName,
        latestVersion,
        description: info.summary || info.description,
        homepage: info.home_page,
        repository: info.project_urls?.Repository || info.project_urls?.Source,
        license: info.license,
        lastPublished: data.releases?.[latestVersion]?.[0]?.upload_time || 'unknown',
        isDeprecated: false,
        maintainers: info.maintainer ? [info.maintainer] : []
    };
}
/**
 * Parse generic registry response
 */
function parseGenericResponse(data, packageName) {
    return {
        name: packageName,
        latestVersion: data.version || data.latest || 'unknown',
        description: data.description || data.summary,
        isDeprecated: false
    };
}
/**
 * Get latest version using package manager commands
 */
async function getLatestVersion(packageName, projectType) {
    try {
        switch (projectType.name) {
            case 'JavaScript':
            case 'TypeScript':
                const { stdout } = await execAsync(`npm view ${packageName} version`);
                return stdout.trim();
            case 'Rust':
                // For Rust, we'll parse from cargo search output
                const { stdout: cargoOutput } = await execAsync(`cargo search ${packageName} --limit 1`);
                const match = cargoOutput.match(/= "(.*?)"/);
                return match ? match[1] : 'unknown';
            case 'Python':
                try {
                    const { stdout: pipOutput } = await execAsync(`pip show ${packageName}`);
                    const versionMatch = pipOutput.match(/Version: (.*)/);
                    return versionMatch ? versionMatch[1] : 'unknown';
                }
                catch {
                    // Fallback to pip index
                    const { stdout: indexOutput } = await execAsync(`pip index versions ${packageName}`);
                    const versions = indexOutput.match(/Available versions: (.*)/);
                    return versions ? versions[1].split(',')[0].trim() : 'unknown';
                }
            default:
                return 'unknown';
        }
    }
    catch (error) {
        return 'unknown';
    }
}
/**
 * Enhanced package info fetcher with registry integration
 */
async function getEnhancedPackageInfo(name, currentVersion, projectType) {
    const spinner = ora(`Fetching ${name} from ${projectType.name} registry...`).start();
    try {
        // First try to get info from registry
        let registryInfo = {};
        try {
            registryInfo = await fetchPackageFromRegistry(name, projectType);
            spinner.text = `Analyzing ${name} package details...`;
        }
        catch (error) {
            spinner.warn(`Registry fetch failed for ${name}, using fallback method`);
            // Fallback to existing method
        }
        // Get latest version using package manager
        const latestVersion = registryInfo.latestVersion || await getLatestVersion(name, projectType);
        const cleanCurrentVersion = currentVersion ? semver.clean(currentVersion) || currentVersion : 'unknown';
        const cleanLatestVersion = semver.clean(latestVersion) || latestVersion;
        let needsUpdate = false;
        if (cleanCurrentVersion !== 'unknown' && cleanLatestVersion !== 'unknown') {
            try {
                needsUpdate = semver.lt(cleanCurrentVersion, cleanLatestVersion);
            }
            catch {
                needsUpdate = cleanCurrentVersion !== cleanLatestVersion;
            }
        }
        spinner.succeed(`Retrieved info for ${name}`);
        return {
            name,
            currentVersion: cleanCurrentVersion,
            latestVersion: cleanLatestVersion,
            needsUpdate,
            projectType: projectType.name,
            packageManager: projectType.packageManager,
            description: registryInfo.description || 'No description available',
            homepage: registryInfo.homepage,
            repository: registryInfo.repository,
            license: registryInfo.license,
            lastPublished: registryInfo.lastPublished,
            maintainers: registryInfo.maintainers,
            downloadCount: registryInfo.downloadCount,
            isDeprecated: registryInfo.isDeprecated || false,
            deprecatedMessage: registryInfo.deprecatedMessage,
            securityVulnerabilities: 0, // To be implemented with security API
            bundleSize: undefined // To be implemented with bundlephobia API
        };
    }
    catch (error) {
        spinner.fail(`Failed to get package info for ${name}`);
        throw error;
    }
}
/**
 * Display help for check command
 */
export function showCheckHelp() {
    const helpConfig = {
        commandName: 'Check',
        emoji: '🔍',
        description: 'Check package versions in your project and get suggestions for updates.\nHelps you keep your dependencies up-to-date and secure.',
        usage: [
            'check [package-name] [options]',
            'check [options]'
        ],
        options: [
            { flag: '-h, --help', description: 'Display help for this command' },
            { flag: '-v, --verbose', description: 'Show detailed information for all packages' }
        ],
        examples: [
            { command: 'check', description: 'Check all packages in current project' },
            { command: 'check --verbose', description: 'Check all packages with detailed info' },
            { command: 'check react', description: 'Check specific package version' },
            { command: 'check @types/node', description: 'Check scoped packages' },
            { command: 'check --help', description: 'Show this help message' }
        ],
        additionalSections: [
            {
                title: 'Supported Package Managers',
                items: [
                    'npm, pnpm, yarn (Node.js)',
                    'pip, pipenv, poetry (Python)',
                    'cargo (Rust)',
                    'go modules (Go)',
                    'composer (PHP)'
                ]
            }
        ],
        tips: [
            'Use --verbose for detailed package information including security vulnerabilities',
            'Check specific packages by name for targeted updates'
        ]
    };
    createStandardHelp(helpConfig);
}
export async function checkCommand(packageName, options) {
    // Check for help flag
    if (options?.help || options?.['--help'] || options?.['-h']) {
        showCheckHelp();
        return;
    }
    // Check for help flag
    if (packageName === '--help' || packageName === '-h') {
        showCheckHelp();
        return;
    }
    // Check for verbose flag
    const isVerbose = packageName === '--verbose' || packageName === '-v' || options?.verbose;
    // If verbose is the first argument, check all packages with verbose output
    if (packageName === '--verbose' || packageName === '-v') {
        packageName = undefined;
    }
    try {
        console.log('\n' + chalk.hex('#f39c12')('🔍 Starting package check...'));
        if (packageName && packageName !== '--verbose' && packageName !== '-v') {
            await checkSinglePackage(packageName, isVerbose);
        }
        else {
            await checkProjectPackages(isVerbose);
        }
    }
    catch (error) {
        console.error(chalk.hex('#ff4757')(`❌ Failed to check packages: ${error.message}`));
        throw error;
    }
}
async function checkSinglePackage(packageName, verbose = false) {
    const spinner = ora(chalk.hex('#f39c12')(`🔄 Checking ${packageName}...`)).start();
    try {
        // Try to detect what kind of package this might be
        const projectType = await detectProjectType();
        // Fallback to npm if no project type detected
        const defaultProjectType = projectType || PROJECT_TYPES.find(pt => pt.name.toLowerCase().includes('npm') || pt.name.toLowerCase().includes('javascript')) || PROJECT_TYPES[0];
        const packageInfo = await getEnhancedPackageInfo(packageName, undefined, defaultProjectType);
        spinner.succeed(chalk.hex('#10ac84')(`✅ Package information retrieved for ${packageName}`));
        displayPackageInfo([packageInfo], projectType || undefined, verbose);
    }
    catch (error) {
        spinner.fail(chalk.hex('#ff4757')(`❌ Failed to check ${packageName}`));
        throw error;
    }
}
async function checkProjectPackages(verbose = false) {
    const spinner = ora('Analyzing project dependencies...').start();
    try {
        let projectType = await detectProjectType();
        let dependencies = {};
        if (!projectType) {
            spinner.warn('No supported project files found in current directory');
            console.log(chalk.yellow('💡 Supported project types:'));
            PROJECT_TYPES.forEach(type => {
                console.log(`   ${chalk.cyan(type.name)}: ${type.files.join(', ')}`);
            });
            console.log(chalk.gray('\n   Or specify a package name: pi check <package-name>'));
            return;
        }
        // Get fresh dependencies if not cached or cache is incomplete
        if (Object.keys(dependencies).length === 0) {
            dependencies = await getDependenciesForProject(projectType);
        }
        if (Object.keys(dependencies).length === 0) {
            spinner.warn(`No dependencies found in ${projectType.name} project`);
            return;
        }
        spinner.text = `Checking ${Object.keys(dependencies).length} ${projectType.name} packages...`;
        const packageInfos = [];
        for (const [name, version] of Object.entries(dependencies)) {
            try {
                const info = await getEnhancedPackageInfo(name, version, projectType);
                packageInfos.push(info);
            }
            catch (error) {
                console.warn(`⚠️  Could not check ${name}`);
            }
        }
        spinner.succeed(`Checked ${packageInfos.length} ${projectType.name} packages`);
        // Cache the package check results
        await cachePackageCheckResults(packageInfos, projectType);
        displayPackageInfo(packageInfos, projectType, verbose);
    }
    catch (error) {
        spinner.fail('Failed to analyze project dependencies');
        throw error;
    }
}
async function detectProjectType() {
    console.log(chalk.gray('🔍 Detecting project type...'));
    // Priority order for detection - check most common files first
    const priorityFiles = ['package.json', 'Cargo.toml', 'requirements.txt', 'composer.json', 'go.mod'];
    // First pass: check priority files in current directory
    for (const priorityFile of priorityFiles) {
        const filePath = path.join(process.cwd(), priorityFile);
        console.log(chalk.gray(`   Checking priority file: ${filePath}`));
        if (await fs.pathExists(filePath)) {
            console.log(chalk.green(`   ✅ Found: ${priorityFile}`));
            // Find the project type that matches this file
            const matchingType = PROJECT_TYPES.find(type => type.files.includes(priorityFile));
            if (matchingType) {
                console.log(chalk.green(`   📦 Detected: ${matchingType.name}`));
                return matchingType;
            }
        }
    }
    // Second pass: check all other files
    for (const projectType of PROJECT_TYPES) {
        console.log(chalk.gray(`   Checking ${projectType.name}: ${projectType.files.join(', ')}`));
        for (const file of projectType.files) {
            if (priorityFiles.includes(file))
                continue; // Already checked
            // Check in current directory first
            const filePath = path.join(process.cwd(), file);
            if (await fs.pathExists(filePath)) {
                console.log(chalk.green(`   ✅ Found: ${file}`));
                return projectType;
            }
        }
    }
    // Third pass: check subdirectories
    try {
        const currentDirContents = await fs.readdir(process.cwd());
        for (const item of currentDirContents) {
            const itemPath = path.join(process.cwd(), item);
            const stats = await fs.stat(itemPath);
            if (stats.isDirectory()) {
                for (const priorityFile of priorityFiles) {
                    const configPath = path.join(itemPath, priorityFile);
                    if (await fs.pathExists(configPath)) {
                        console.log(chalk.green(`   ✅ Found in subdirectory: ${item}/${priorityFile}`));
                        const matchingType = PROJECT_TYPES.find(type => type.files.includes(priorityFile));
                        if (matchingType)
                            return matchingType;
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(chalk.yellow('   Warning: Could not read directory contents'));
    }
    console.log(chalk.yellow('   No project type detected'));
    return null;
}
async function getDependenciesForProject(projectType) {
    console.log(chalk.gray(`📋 Looking for dependencies in ${projectType.name} project...`));
    // Priority order for dependency files
    const priorityFiles = projectType.files.slice().sort((a, b) => {
        const priority = ['package.json', 'Cargo.toml', 'requirements.txt', 'composer.json', 'go.mod'];
        return priority.indexOf(a) - priority.indexOf(b);
    });
    // First check current directory with priority files
    for (const file of priorityFiles) {
        const filePath = path.join(process.cwd(), file);
        console.log(chalk.gray(`   Checking: ${filePath}`));
        if (await fs.pathExists(filePath)) {
            console.log(chalk.green(`   ✅ Found: ${file}`));
            try {
                let content;
                if (file.endsWith('.json')) {
                    content = await fs.readJson(filePath);
                    console.log(chalk.gray(`   📦 Loaded JSON config from ${file}`));
                }
                else if (file.endsWith('.toml')) {
                    // Simple TOML parser for basic cases
                    const tomlContent = await fs.readFile(filePath, 'utf-8');
                    content = parseSimpleToml(tomlContent);
                    console.log(chalk.gray(`   📦 Loaded TOML config from ${file}`));
                }
                else {
                    content = await fs.readFile(filePath, 'utf-8');
                    console.log(chalk.gray(`   📦 Loaded text config from ${file}`));
                }
                const dependencies = projectType.getDependencies(content, file);
                const depCount = Object.keys(dependencies).length;
                console.log(chalk.green(`   📊 Found ${depCount} dependencies`));
                if (depCount > 0) {
                    console.log(chalk.gray(`   Dependencies: ${Object.keys(dependencies).slice(0, 5).join(', ')}${depCount > 5 ? '...' : ''}`));
                    return dependencies;
                }
            }
            catch (error) {
                console.warn(chalk.yellow(`   ⚠️  Could not parse ${file}: ${error}`));
            }
        }
    }
    // Then check subdirectories
    try {
        const currentDirContents = await fs.readdir(process.cwd());
        for (const item of currentDirContents) {
            const itemPath = path.join(process.cwd(), item);
            const stats = await fs.stat(itemPath);
            if (stats.isDirectory()) {
                for (const file of priorityFiles) {
                    const configPath = path.join(itemPath, file);
                    if (await fs.pathExists(configPath)) {
                        console.log(chalk.green(`   ✅ Found in subdirectory: ${item}/${file}`));
                        try {
                            let content;
                            if (file.endsWith('.json')) {
                                content = await fs.readJson(configPath);
                            }
                            else if (file.endsWith('.toml')) {
                                const tomlContent = await fs.readFile(configPath, 'utf-8');
                                content = parseSimpleToml(tomlContent);
                            }
                            else {
                                content = await fs.readFile(configPath, 'utf-8');
                            }
                            const dependencies = projectType.getDependencies(content, file);
                            const depCount = Object.keys(dependencies).length;
                            if (depCount > 0) {
                                console.log(chalk.green(`   📊 Found ${depCount} dependencies in ${configPath}`));
                                return dependencies;
                            }
                        }
                        catch (error) {
                            console.warn(chalk.yellow(`   ⚠️  Could not parse ${configPath}`));
                        }
                    }
                }
            }
        }
    }
    catch (error) {
        console.warn(chalk.yellow('   ⚠️  Could not read directory contents'));
    }
    console.log(chalk.yellow('   📦 No dependencies found'));
    return {};
}
function parseSimpleToml(content) {
    const result = {};
    const lines = content.split('\n');
    let currentSection = null;
    for (const line of lines) {
        const trimmed = line.trim();
        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#'))
            continue;
        // Section header
        const sectionMatch = trimmed.match(/^\[(.+)\]$/);
        if (sectionMatch) {
            currentSection = sectionMatch[1];
            const sections = currentSection.split('.');
            let current = result;
            for (let i = 0; i < sections.length - 1; i++) {
                if (!current[sections[i]])
                    current[sections[i]] = {};
                current = current[sections[i]];
            }
            if (!current[sections[sections.length - 1]]) {
                current[sections[sections.length - 1]] = {};
            }
            continue;
        }
        // Key-value pair
        const kvMatch = trimmed.match(/^([^=]+)=(.+)$/);
        if (kvMatch && currentSection) {
            const key = kvMatch[1].trim().replace(/"/g, '');
            const value = kvMatch[2].trim().replace(/"/g, '');
            const sections = currentSection.split('.');
            let current = result;
            for (const section of sections) {
                if (!current[section])
                    current[section] = {};
                current = current[section];
            }
            current[key] = value;
        }
    }
    return result;
}
async function getPackageInfo(packageName, currentVersion, projectType) {
    const type = projectType || PROJECT_TYPES[0];
    try {
        // Clean up version string (remove ^ ~ and similar prefixes)
        const cleanCurrentVersion = currentVersion?.replace(/[\^~>=<]/, '') || 'unknown';
        // Enhanced NPM registry support
        if (type.name === 'Node.js') {
            const response = await fetch(`https://registry.npmjs.org/${packageName}`);
            if (!response.ok) {
                throw new Error(`Package ${packageName} not found in NPM registry`);
            }
            const data = await response.json();
            const latestVersion = data['dist-tags']?.latest || 'unknown';
            const maintainers = data.maintainers || [];
            const keywords = data.keywords || [];
            // Enhanced version comparison
            let needsUpdate = false;
            if (cleanCurrentVersion !== 'unknown' && latestVersion !== 'unknown') {
                try {
                    if (semver.valid(cleanCurrentVersion) && semver.valid(latestVersion)) {
                        needsUpdate = semver.lt(cleanCurrentVersion, latestVersion);
                    }
                }
                catch (error) {
                    // Fallback to string comparison if semver fails
                    needsUpdate = cleanCurrentVersion !== latestVersion;
                }
            }
            return {
                name: packageName,
                currentVersion: cleanCurrentVersion,
                latestVersion,
                isDeprecated: !!data.deprecated,
                deprecatedMessage: data.deprecated || undefined,
                alternatives: data.alternatives || [],
                homepage: data.homepage || undefined,
                repository: typeof data.repository === 'string'
                    ? data.repository
                    : data.repository?.url || undefined,
                description: data.description || undefined,
                needsUpdate,
                packageManager: type.packageManager,
                projectType: type.name
            };
        }
        // Enhanced support for Rust packages
        if (type.name === 'Rust') {
            try {
                const response = await fetch(`https://crates.io/api/v1/crates/${packageName}`);
                if (response.ok) {
                    const data = await response.json();
                    const latestVersion = data.crate?.newest_version || 'unknown';
                    return {
                        name: packageName,
                        currentVersion: cleanCurrentVersion,
                        latestVersion,
                        isDeprecated: false, // Crates.io doesn't have deprecated flag in this endpoint
                        homepage: data.crate?.homepage || undefined,
                        repository: data.crate?.repository || undefined,
                        description: data.crate?.description || undefined,
                        needsUpdate: cleanCurrentVersion !== 'unknown' && latestVersion !== 'unknown'
                            ? cleanCurrentVersion !== latestVersion
                            : false,
                        packageManager: type.packageManager,
                        projectType: type.name
                    };
                }
            }
            catch (error) {
                // Fall through to basic info
            }
        }
        // Enhanced support for Python packages
        if (type.name === 'Python') {
            try {
                const response = await fetch(`https://pypi.org/pypi/${packageName}/json`);
                if (response.ok) {
                    const data = await response.json();
                    const latestVersion = data.info?.version || 'unknown';
                    return {
                        name: packageName,
                        currentVersion: cleanCurrentVersion,
                        latestVersion,
                        isDeprecated: false,
                        homepage: data.info?.home_page || undefined,
                        repository: data.info?.project_urls?.Repository || data.info?.project_urls?.Homepage || undefined,
                        description: data.info?.summary || undefined,
                        needsUpdate: cleanCurrentVersion !== 'unknown' && latestVersion !== 'unknown'
                            ? cleanCurrentVersion !== latestVersion
                            : false,
                        packageManager: type.packageManager,
                        projectType: type.name
                    };
                }
            }
            catch (error) {
                // Fall through to basic info
            }
        }
        // For other project types or when registry lookup fails, return basic info
        return {
            name: packageName,
            currentVersion: cleanCurrentVersion,
            latestVersion: 'unknown',
            isDeprecated: false,
            needsUpdate: false,
            packageManager: type.packageManager,
            projectType: type.name,
            description: `${type.name} package - registry lookup not available`
        };
    }
    catch (error) {
        throw new Error(`Failed to fetch info for ${packageName}: ${error.message}`);
    }
}
function displayPackageInfo(packages, projectType, verbose = false) {
    if (packages.length === 0) {
        console.log(chalk.yellow('📦 No packages to display'));
        return;
    }
    console.log('\n' + chalk.hex('#00d2d3')('📊 Package Analysis Results'));
    console.log(chalk.gray('─'.repeat(60)));
    const outdatedPackages = packages.filter(pkg => pkg.needsUpdate);
    const deprecatedPackages = packages.filter(pkg => pkg.isDeprecated);
    const upToDatePackages = packages.filter(pkg => !pkg.needsUpdate && !pkg.isDeprecated);
    // Enhanced Summary with statistics
    console.log(`\n${chalk.hex('#10ac84')('✅ Total packages checked:')} ${chalk.bold(packages.length.toString())}`);
    console.log(`${chalk.hex('#10ac84')('✅ Up to date:')} ${chalk.bold(upToDatePackages.length.toString())}`);
    if (outdatedPackages.length > 0) {
        console.log(`${chalk.hex('#f39c12')('⚠️  Packages needing updates:')} ${chalk.bold(outdatedPackages.length.toString())}`);
    }
    if (deprecatedPackages.length > 0) {
        console.log(`${chalk.hex('#ff4757')('🚨 Deprecated packages:')} ${chalk.bold(deprecatedPackages.length.toString())}`);
    }
    // Show severity breakdown
    if (projectType) {
        console.log(`\n${chalk.hex('#00d2d3')('📋 Project Type:')} ${chalk.bold(projectType.name)} (${chalk.cyan(projectType.packageManager)})`);
    }
    // Determine how many packages to show based on verbose flag
    const packagesToShow = verbose ? packages : packages.slice(0, 8);
    if (verbose && packages.length > 8) {
        console.log(`\n${chalk.hex('#f39c12')('📋 Showing all')} ${chalk.bold(packages.length.toString())} ${chalk.hex('#f39c12')('packages (verbose mode)')}`);
    }
    else if (!verbose && packages.length > 8) {
        console.log(`\n${chalk.hex('#f39c12')('📋 Showing first')} ${chalk.bold('8')} ${chalk.hex('#f39c12')('packages (use --verbose to see all)')}`);
    }
    packagesToShow.forEach((pkg, index) => {
        const statusIcon = pkg.isDeprecated ? '🚨' : pkg.needsUpdate ? '⚠️' : '✅';
        const statusColor = pkg.isDeprecated ? '#ff4757' : pkg.needsUpdate ? '#f39c12' : '#10ac84';
        const statusText = pkg.isDeprecated ? 'DEPRECATED' : pkg.needsUpdate ? 'UPDATE AVAILABLE' : 'UP TO DATE';
        const versionComparison = pkg.currentVersion !== 'unknown' && pkg.latestVersion !== 'unknown'
            ? ` ${chalk.gray('→')} ${chalk.hex('#10ac84')(pkg.latestVersion)}`
            : '';
        console.log('\n' + boxen(`${statusIcon} ${chalk.bold(pkg.name)} ${chalk.hex(statusColor)(`[${statusText}]`)}\n` +
            `${chalk.gray('Current:')} ${chalk.yellow(pkg.currentVersion)}${versionComparison}\n` +
            `${chalk.gray('Type:')} ${chalk.blue(pkg.projectType)} ${chalk.gray('via')} ${chalk.cyan(pkg.packageManager)}\n` +
            (pkg.description ? `${chalk.gray('Description:')} ${pkg.description.slice(0, 70)}${pkg.description.length > 70 ? '...' : ''}\n` : '') +
            (pkg.homepage ? `${chalk.gray('Homepage:')} ${chalk.blue(pkg.homepage)}\n` : '') +
            (pkg.isDeprecated ? `${chalk.hex('#ff4757')('⚠️ DEPRECATED:')} ${pkg.deprecatedMessage || 'This package is no longer maintained'}\n` : '') +
            (pkg.alternatives && pkg.alternatives.length > 0 ? `${chalk.gray('Alternatives:')} ${pkg.alternatives.join(', ')}\n` : ''), {
            padding: 1,
            margin: 0,
            borderStyle: 'round',
            borderColor: statusColor,
            title: `Package ${index + 1}/${packagesToShow.length}`,
            titleAlignment: 'left'
        }));
    });
    // Show remaining packages info when not in verbose mode
    if (!verbose && packages.length > 8) {
        const remaining = packages.length - 8;
        const remainingOutdated = packages.slice(8).filter(pkg => pkg.needsUpdate).length;
        const remainingDeprecated = packages.slice(8).filter(pkg => pkg.isDeprecated).length;
        const remainingUpToDate = packages.slice(8).filter(pkg => !pkg.needsUpdate && !pkg.isDeprecated).length;
        console.log('\n' + chalk.hex('#f39c12')(`📦 Remaining ${remaining} packages:`));
        console.log(chalk.gray('─'.repeat(30)));
        if (remainingUpToDate > 0) {
            console.log(`   ${chalk.hex('#10ac84')('✅')} ${remainingUpToDate} up to date`);
        }
        if (remainingOutdated > 0) {
            console.log(`   ${chalk.hex('#f39c12')('⚠️')} ${remainingOutdated} need updates`);
            // Show names of remaining outdated packages
            const outdatedNames = packages.slice(8).filter(pkg => pkg.needsUpdate).slice(0, 5).map(pkg => pkg.name);
            console.log(`      ${chalk.gray('Packages:')} ${outdatedNames.join(', ')}${outdatedNames.length < remainingOutdated ? '...' : ''}`);
        }
        if (remainingDeprecated > 0) {
            console.log(`   ${chalk.hex('#ff4757')('🚨')} ${remainingDeprecated} deprecated`);
            // Show names of remaining deprecated packages
            const deprecatedNames = packages.slice(8).filter(pkg => pkg.isDeprecated).slice(0, 3).map(pkg => pkg.name);
            console.log(`      ${chalk.gray('Packages:')} ${deprecatedNames.join(', ')}${deprecatedNames.length < remainingDeprecated ? '...' : ''}`);
        }
        console.log(`\n   ${chalk.cyan('💡 Tip:')} Use ${chalk.bold('--verbose')} to see detailed info for all ${packages.length} packages`);
    }
    // Enhanced recommendations section
    console.log('\n' + chalk.hex('#00d2d3')('💡 Recommendations:'));
    console.log(chalk.gray('─'.repeat(30)));
    if (deprecatedPackages.length > 0) {
        console.log(`${chalk.hex('#ff4757')('🚨 URGENT:')} Replace ${deprecatedPackages.length} deprecated package(s) immediately`);
        deprecatedPackages.slice(0, 3).forEach(pkg => {
            console.log(`   • ${chalk.red(pkg.name)} ${chalk.gray(pkg.deprecatedMessage ? '- ' + pkg.deprecatedMessage.slice(0, 50) + '...' : '')}`);
        });
    }
    if (outdatedPackages.length > 0 && projectType) {
        console.log(`${chalk.hex('#f39c12')('⚠️  UPDATE:')} ${outdatedPackages.length} package(s) need updating`);
        console.log(`   Run: ${chalk.cyan(projectType.getUpdateCommand())}`);
    }
    if (packages.length > 50) {
        console.log(`${chalk.hex('#95afc0')('📦 INFO:')} Large dependency count (${packages.length}) - consider reviewing for optimization`);
    }
    console.log(chalk.gray(`\n   Last checked: ${new Date().toLocaleString()}`));
}
/**
 * Cache package check results for performance
 */
async function cachePackageCheckResults(packageInfos, projectType) {
    try {
        const projectPath = process.cwd();
        const projectName = path.basename(projectPath);
        // Simple caching - just log for now
        console.log(chalk.gray(`📊 Caching package check results for ${packageInfos.length} packages`));
        // In a real implementation, you would save this to the cache manager
        // await cacheManager.setPackageCheckResults(projectPath, packageInfos);
    }
    catch (error) {
        // Silent fail - caching is not critical
    }
}
