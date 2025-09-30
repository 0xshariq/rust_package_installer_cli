/**
 * Feature installer utility - Handles adding authentication, Docker, and other features to projects
 */
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { installPackages } from './dependencyInstaller.js';
import { detectLanguageFromFiles } from './languageConfig.js';
import { cacheProjectData } from './cacheManager.js';
import { getCliRootPath, getFeaturesJsonPath } from './pathResolver.js';
import { getAvailableFeatures } from '../commands/add.js';
// Get the directory of this file for proper path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load supported features from cached or direct file access
let SUPPORTED_FEATURES = {};
/**
 * Load features from cache or file system with new jsonPath structure
 */
async function loadFeatures() {
    try {
        // Get CLI installation directory using the centralized path resolver
        const featuresPath = getFeaturesJsonPath();
        if (await fs.pathExists(featuresPath)) {
            const featuresData = await fs.readJson(featuresPath);
            const featuresConfig = featuresData.features || featuresData;
            // Get available features using the centralized function
            const availableFeatures = await getAvailableFeatures();
            console.log(chalk.gray(`📦 Loading ${availableFeatures.length} available features...`));
            // Process each feature and load its individual JSON file
            for (const [featureName, config] of Object.entries(featuresConfig)) {
                const featureConfig = config;
                if (featureConfig.jsonPath) {
                    try {
                        // Load the individual feature JSON file
                        const individualFeaturePath = path.resolve(path.dirname(featuresPath), featureConfig.jsonPath);
                        if (await fs.pathExists(individualFeaturePath)) {
                            const individualFeatureData = await fs.readJson(individualFeaturePath);
                            // Merge the base config with the individual feature data
                            // The individual JSON files directly contain the provider structure
                            SUPPORTED_FEATURES[featureName] = {
                                supportedFrameworks: featureConfig.supportedFrameworks || [],
                                supportedLanguages: featureConfig.supportedLanguages || [],
                                files: individualFeatureData, // Direct provider structure
                                description: featureConfig.description
                            };
                        }
                        else {
                            console.warn(chalk.yellow(`⚠️  Individual feature file not found: ${individualFeaturePath}`));
                            // Fallback to base config
                            SUPPORTED_FEATURES[featureName] = {
                                supportedFrameworks: featureConfig.supportedFrameworks || [],
                                supportedLanguages: featureConfig.supportedLanguages || [],
                                files: {},
                                description: featureConfig.description
                            };
                        }
                    }
                    catch (error) {
                        console.warn(chalk.yellow(`⚠️  Could not load individual feature file for ${featureName}`));
                        // Fallback to base config
                        SUPPORTED_FEATURES[featureName] = {
                            supportedFrameworks: featureConfig.supportedFrameworks || [],
                            supportedLanguages: featureConfig.supportedLanguages || [],
                            files: {},
                            description: featureConfig.description
                        };
                    }
                }
                else {
                    // Legacy format - direct files in config
                    SUPPORTED_FEATURES[featureName] = {
                        supportedFrameworks: featureConfig.supportedFrameworks || [],
                        supportedLanguages: featureConfig.supportedLanguages || [],
                        files: featureConfig.files || {},
                        description: featureConfig.description
                    };
                }
            }
        }
        else {
            console.warn(chalk.yellow(`⚠️  Features file not found at: ${featuresPath}`));
        }
    }
    catch (error) {
        console.warn(chalk.yellow('⚠️  Could not load features.json, using fallback configuration'));
    }
}
// Initialize features on module load
await loadFeatures();
// Export for use in other modules
export { SUPPORTED_FEATURES };
// Re-export path utilities for backward compatibility
export { getCliRootPath } from './pathResolver.js';
/**
 * Detect the current project's framework and language with improved logic
 */
/**
 * Detect if a Next.js project uses src folder structure (Next.js only)
 */
async function detectNextjsSrcStructure(projectPath) {
    try {
        const srcPath = path.join(projectPath, 'src');
        if (!await fs.pathExists(srcPath)) {
            return false;
        }
        // Check for Next.js App Router (app directory in src)
        const srcAppPath = path.join(srcPath, 'app');
        if (await fs.pathExists(srcAppPath)) {
            return true;
        }
        // Check for Next.js Pages Router (pages directory in src) 
        const srcPagesPath = path.join(srcPath, 'pages');
        if (await fs.pathExists(srcPagesPath)) {
            return true;
        }
        // Check for components, lib, utils directories in src (common Next.js patterns)
        const commonDirs = ['components', 'lib', 'utils', 'styles', 'hooks'];
        for (const dir of commonDirs) {
            const dirPath = path.join(srcPath, dir);
            if (await fs.pathExists(dirPath)) {
                return true;
            }
        }
        // Check for any TypeScript/JavaScript files in src root
        const srcFiles = await fs.readdir(srcPath);
        const codeFiles = srcFiles.filter(file => file.endsWith('.ts') || file.endsWith('.tsx') ||
            file.endsWith('.js') || file.endsWith('.jsx'));
        return codeFiles.length > 0;
    }
    catch (error) {
        return false;
    }
}
/**
 * Adjust file path for Next.js src folder structure (Next.js specific)
 * Dynamically places files in src/ folder based on their path structure
 */
function adjustNextjsSrcFilePath(filePath, hasSrcFolder, projectPath) {
    // If project doesn't use src folder, return original path
    if (!hasSrcFolder) {
        return path.join(projectPath, filePath);
    }
    // Files that should ALWAYS be in root regardless of src folder for Next.js
    const rootOnlyFiles = [
        '.env', '.env.local', '.env.example', '.env.development', '.env.production',
        'package.json', 'next.config.js', 'next.config.mjs', 'next.config.ts',
        'tailwind.config.js', 'tailwind.config.ts', 'postcss.config.js', 'postcss.config.ts',
        'middleware.ts', 'middleware.js', 'tsconfig.json', 'jsconfig.json'
    ];
    const fileName = path.basename(filePath);
    // Always put public/ files in root public/
    if (filePath.startsWith('public/')) {
        return path.join(projectPath, filePath);
    }
    // Always put root-only files in project root
    if (rootOnlyFiles.includes(fileName)) {
        return path.join(projectPath, filePath);
    }
    // If filePath already starts with src/, keep as is
    if (filePath.startsWith('src/')) {
        return path.join(projectPath, filePath);
    }
    // For app/pages/components/lib/utils/hooks/styles/types, put in src/
    const srcDirs = ['app', 'pages', 'components', 'lib', 'utils', 'styles', 'hooks', 'types'];
    if (srcDirs.some(dir => filePath.startsWith(dir + '/'))) {
        return path.join(projectPath, 'src', filePath);
    }
    // For .ts/.tsx/.js/.jsx files not in config, put in src/
    if (fileName.match(/\.(ts|tsx|js|jsx)$/) && !fileName.includes('config')) {
        return path.join(projectPath, 'src', filePath);
    }
    // Default: put in src/
    return path.join(projectPath, 'src', filePath);
}
/**
 * Adjust file path for framework-specific folder structures
 * Dynamically places files based on detected project structure
 */
function adjustFrameworkFilePath(filePath, framework, hasSrcFolder, projectPath) {
    // Files that should ALWAYS be in root regardless of src folder
    const rootOnlyFiles = [
        '.env',
        '.env.local',
        '.env.example',
        '.env.development',
        '.env.production',
        'package.json',
        'next.config.js',
        'next.config.mjs',
        'next.config.ts',
        'tailwind.config.js',
        'tailwind.config.ts',
        'postcss.config.js',
        'postcss.config.ts',
        'middleware.ts',
        'middleware.js',
        'vite.config.js',
        'vite.config.ts',
        'nuxt.config.js',
        'nuxt.config.ts',
        'vue.config.js',
        'angular.json',
        'nest-cli.json',
        'tsconfig.json',
        'jsconfig.json',
        '.gitignore',
        'README.md',
        'docker-compose.yml',
        'Dockerfile'
    ];
    const fileName = path.basename(filePath);
    const fileDir = path.dirname(filePath);
    // Check if this file should always be in root
    if (rootOnlyFiles.includes(fileName) || filePath.startsWith('public/')) {
        return path.join(projectPath, filePath);
    }
    // Framework-specific logic for src folder structure
    switch (framework) {
        case 'nextjs':
            return adjustNextjsSrcFilePath(filePath, hasSrcFolder, projectPath);
        case 'reactjs':
        case 'vuejs':
        case 'angularjs': {
            if (hasSrcFolder && !filePath.startsWith('src/')) {
                const appDirs = ['components', 'pages', 'lib', 'utils', 'hooks', 'services', 'types'];
                const isAppFile = appDirs.some(dir => filePath.startsWith(dir + '/')) ||
                    fileName.match(/\.(jsx?|tsx?|vue)$/) && !fileName.includes('config');
                if (isAppFile) {
                    return path.join(projectPath, 'src', filePath);
                }
            }
            return path.join(projectPath, filePath);
        }
        case 'nestjs': {
            if (!filePath.startsWith('src/') && !rootOnlyFiles.includes(fileName)) {
                return path.join(projectPath, 'src', filePath);
            }
            return path.join(projectPath, filePath);
        }
        default: {
            if (hasSrcFolder && !filePath.startsWith('src/') && !rootOnlyFiles.includes(fileName)) {
                const backendFiles = ['controllers', 'routes', 'services', 'utils', 'middleware', 'models'];
                const shouldGoInSrc = backendFiles.some(dir => filePath.startsWith(dir + '/')) ||
                    (fileName.match(/\.(js|ts)$/) && fileDir !== '.' && !fileName.includes('config'));
                if (shouldGoInSrc) {
                    return path.join(projectPath, 'src', filePath);
                }
            }
            return path.join(projectPath, filePath);
        }
    }
}
export async function detectProjectStack(projectPath) {
    try {
        // Skip cache lookup for simplicity - always detect fresh
        // Detect language first
        const files = await fs.readdir(projectPath);
        const detectedLanguages = detectLanguageFromFiles(files);
        const primaryLanguage = detectedLanguages[0];
        let framework;
        let isComboTemplate = false;
        let packageManager = 'npm';
        let projectLanguage = 'javascript';
        let hasSrcFolder = false;
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (await fs.pathExists(packageJsonPath)) {
            const packageJson = await fs.readJson(packageJsonPath);
            const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
            // Detect TypeScript
            if (await fs.pathExists(path.join(projectPath, 'tsconfig.json'))) {
                projectLanguage = 'typescript';
            }
            else if (dependencies['typescript']) {
                projectLanguage = 'typescript';
            }
            // Check for src folder structure
            hasSrcFolder = await fs.pathExists(path.join(projectPath, 'src'));
            // Detect package manager
            packageManager = await detectPackageManager(projectPath);
            // Detect framework
            if (dependencies['next']) {
                framework = 'nextjs';
                // For Next.js projects, do a more thorough src folder detection
                hasSrcFolder = await detectNextjsSrcStructure(projectPath);
            }
            else if (dependencies['react']) {
                framework = 'reactjs';
            }
            else if (dependencies['express']) {
                framework = 'expressjs';
            }
            else if (dependencies['@nestjs/core']) {
                framework = 'nestjs';
            }
            else if (dependencies['vue']) {
                framework = 'vuejs';
            }
            else if (dependencies['@angular/core']) {
                framework = 'angularjs';
            }
            else if (dependencies['@remix-run/react']) {
                framework = 'remixjs';
            }
            // For other frameworks, simple src folder check
            if (framework !== 'nextjs' && !hasSrcFolder) {
                hasSrcFolder = await fs.pathExists(path.join(projectPath, 'src'));
            }
            // Cache the detected information
            await cacheProjectData(projectPath, packageJson.name || path.basename(projectPath), typeof projectLanguage === 'string' ? projectLanguage : 'unknown');
        }
        return {
            framework,
            language: typeof primaryLanguage === 'string' ? primaryLanguage : ((primaryLanguage && typeof primaryLanguage.language === 'string') ? primaryLanguage.language : undefined),
            projectLanguage,
            isComboTemplate,
            packageManager,
            hasSrcFolder
        };
    }
    catch (error) {
        console.error('Error detecting project stack:', error);
        return {};
    }
}
/**
 * Detect package manager for the project
 */
async function detectPackageManager(projectPath) {
    if (await fs.pathExists(path.join(projectPath, 'pnpm-lock.yaml'))) {
        return 'pnpm';
    }
    else if (await fs.pathExists(path.join(projectPath, 'yarn.lock'))) {
        return 'yarn';
    }
    else if (await fs.pathExists(path.join(projectPath, 'bun.lockb'))) {
        return 'bun';
    }
    return 'npm';
}
/**
 * Add a feature to the current project
 */
export async function addFeature(featureName, provider, projectPath = process.cwd()) {
    const spinner = ora(chalk.hex('#9c88ff')(`Adding ${featureName} feature...`)).start();
    try {
        // Ensure features are loaded
        await loadFeatures();
        // Validate project path exists
        if (!await fs.pathExists(projectPath)) {
            throw new Error(`Project path does not exist: ${projectPath}`);
        }
        // Get project information
        const projectInfo = await detectProjectStack(projectPath);
        if (!projectInfo.framework) {
            spinner.warn(chalk.yellow('Could not detect project framework automatically'));
            console.log(chalk.hex('#95afc0')('📋 Supported frameworks: nextjs, expressjs, nestjs, reactjs, vuejs, angularjs, remixjs'));
            throw new Error('Could not detect project framework. Please ensure you\'re in a valid project directory.');
        }
        // Get feature configuration
        const featureConfig = SUPPORTED_FEATURES[featureName];
        if (!featureConfig) {
            const availableFeatures = Object.keys(SUPPORTED_FEATURES);
            throw new Error(`Feature '${featureName}' not found. Available features: ${availableFeatures.join(', ')}`);
        }
        // Check if feature supports this framework
        if (!featureConfig.supportedFrameworks.includes(projectInfo.framework)) {
            throw new Error(`Feature '${featureName}' is not supported for ${projectInfo.framework} projects. Supported frameworks: ${featureConfig.supportedFrameworks.join(', ')}`);
        }
        spinner.text = chalk.hex('#9c88ff')(`Detected ${projectInfo.framework} project (${projectInfo.projectLanguage})`);
        // Check if this feature has a simple structure (framework-based) or complex (provider-based)
        let selectedProvider = provider;
        const availableProviders = Object.keys(featureConfig.files);
        const hasSimpleStructure = availableProviders.includes(projectInfo.framework);
        if (!hasSimpleStructure && !selectedProvider && featureConfig.files) {
            // Complex structure with providers
            if (availableProviders.length > 1) {
                spinner.stop();
                const inquirer = await import('inquirer');
                const { provider: chosenProvider } = await inquirer.default.prompt([
                    {
                        type: 'list',
                        name: 'provider',
                        message: `Choose a ${featureName} provider:`,
                        choices: availableProviders
                    }
                ]);
                selectedProvider = chosenProvider;
                spinner.start(chalk.hex('#9c88ff')(`Adding ${featureName} (${selectedProvider}) feature...`));
            }
            else {
                selectedProvider = availableProviders[0];
            }
        }
        else if (hasSimpleStructure) {
            // Simple structure - use framework as the "provider"
            selectedProvider = projectInfo.framework;
        }
        // Get files for the specific provider, framework, and language
        const files = getFeatureFiles(featureConfig, selectedProvider, projectInfo.framework, projectInfo.projectLanguage);
        if (Object.keys(files).length === 0) {
            throw new Error(`No files configured for ${featureName} with ${selectedProvider} provider for ${projectInfo.framework} (${projectInfo.projectLanguage})`);
        }
        spinner.text = `Processing ${Object.keys(files).length} files...`;
        // Process each file based on its action
        for (const [filePath, fileConfig] of Object.entries(files)) {
            await processFeatureFile(filePath, fileConfig, featureName, selectedProvider, projectInfo, projectPath);
        }
        spinner.succeed(chalk.green(`✅ ${featureName} feature added successfully!`));
        // Update cache with feature usage
        console.log(chalk.gray(`📊 Feature ${featureName} used for ${projectInfo.framework || 'unknown'} project`));
        // Show setup instructions
        showSetupInstructions(featureName, selectedProvider);
        // Show additional helpful messages
        console.log(`\n${chalk.hex('#f39c12')('📋 Next Steps:')}`);
        console.log(chalk.hex('#95afc0')('• Review the created/updated files to ensure they match your project needs'));
        console.log(chalk.hex('#95afc0')('• Update environment variables in .env files with your actual values'));
        console.log(chalk.hex('#95afc0')('• Test the feature integration by running your project'));
        console.log(chalk.hex('#95afc0')('• Check the documentation for any additional configuration steps'));
    }
    catch (error) {
        spinner.fail(chalk.red(`❌ Failed to add ${featureName} feature: ${error.message}`));
        throw error;
    }
}
/**
 * Get feature files for a specific provider, framework, and language
 * Handles both structures:
 * 1. provider -> framework -> language -> files (auth, ai, etc.)
 * 2. framework -> files (docker, gitignore, etc.)
 */
function getFeatureFiles(featureConfig, provider, framework, language) {
    // Check if this is a simple framework-based structure (no providers)
    if (featureConfig.files[framework] && !featureConfig.files[provider]) {
        // Simple structure: framework -> files
        const frameworkConfig = featureConfig.files[framework];
        if (frameworkConfig && typeof frameworkConfig === 'object') {
            // Check if it has action properties (direct files) or language subdirectories
            const firstKey = Object.keys(frameworkConfig)[0];
            if (firstKey && frameworkConfig[firstKey]?.action) {
                // Direct files with actions
                return frameworkConfig;
            }
            else if (frameworkConfig[language]) {
                // Has language subdirectories
                return frameworkConfig[language];
            }
            else if (frameworkConfig['typescript'] && language === 'javascript') {
                // Fallback to typescript
                console.log(chalk.yellow(`⚠️  JavaScript templates not available, using TypeScript templates`));
                return frameworkConfig['typescript'];
            }
        }
        return frameworkConfig || {};
    }
    // Complex structure: provider -> framework -> language -> files
    const providerConfig = featureConfig.files[provider];
    if (!providerConfig)
        return {};
    const frameworkConfig = providerConfig[framework];
    if (!frameworkConfig)
        return {};
    const languageConfig = frameworkConfig[language];
    if (!languageConfig) {
        // Fallback to typescript if javascript not available
        const tsConfig = frameworkConfig['typescript'];
        if (tsConfig && language === 'javascript') {
            console.log(chalk.yellow(`⚠️  JavaScript templates not available, using TypeScript templates`));
            return tsConfig;
        }
        return {};
    }
    return languageConfig;
}
/**
 * Resolve template file path with fallback strategies
 * Handles dynamic resolution for all framework files
 */
async function resolveTemplateFilePath(featureName, provider, framework, language, filePath) {
    const cliRoot = getCliRootPath();
    // Primary path strategies in order of preference
    const pathStrategies = [
        // 1. Full path with all parameters
        path.join(cliRoot, 'features', featureName, provider, framework, language, filePath),
        // 2. Without language subfolder (framework-only)
        path.join(cliRoot, 'features', featureName, provider, framework, filePath),
        // 3. Generic provider path (no framework/language)
        path.join(cliRoot, 'features', featureName, provider, filePath),
        // 4. Feature root path (no provider/framework/language)
        path.join(cliRoot, 'features', featureName, filePath),
        // 5. Try with typescript if javascript doesn't exist
        ...(language === 'javascript' ? [
            path.join(cliRoot, 'features', featureName, provider, framework, 'typescript', filePath)
        ] : []),
        // 6. Try with javascript if typescript doesn't exist  
        ...(language === 'typescript' ? [
            path.join(cliRoot, 'features', featureName, provider, framework, 'javascript', filePath)
        ] : [])
    ];
    // Try each strategy until we find an existing file
    for (const templatePath of pathStrategies) {
        try {
            if (await fs.pathExists(templatePath)) {
                return templatePath;
            }
        }
        catch (error) {
            // Continue to next strategy
            continue;
        }
    }
    return null;
}
/**
 * Process a single feature file based on its action
 */
async function processFeatureFile(filePath, fileConfig, featureName, provider, projectInfo, projectPath) {
    const { action } = fileConfig;
    // Resolve template file path with dynamic fallback strategies
    const sourceFilePath = await resolveTemplateFilePath(featureName, provider, projectInfo.framework, projectInfo.projectLanguage, filePath);
    if (!sourceFilePath) {
        console.warn(chalk.yellow(`⚠️  Template file not found for: ${filePath}`));
        console.log(chalk.gray(`   Searched in feature: ${featureName}, provider: ${provider}, framework: ${projectInfo.framework}, language: ${projectInfo.projectLanguage}`));
        console.log(chalk.gray(`   This might be due to running a globally installed CLI. Consider using 'npx' or installing locally.`));
        return;
    }
    // Handle file path adjustment based on project structure - framework agnostic
    let targetFilePath = adjustFrameworkFilePath(filePath, projectInfo.framework || 'unknown', projectInfo.hasSrcFolder || false, projectPath);
    // Ensure all parent directories exist before processing
    await fs.ensureDir(path.dirname(targetFilePath));
    switch (action) {
        case 'install':
            await handlePackageInstallation(sourceFilePath, projectPath, projectInfo.packageManager || 'npm', projectInfo.language);
            break;
        case 'create':
            await handleFileCreation(sourceFilePath, targetFilePath);
            break;
        case 'overwrite':
            await handleFileOverwrite(sourceFilePath, targetFilePath);
            break;
        case 'append':
            await handleFileAppend(sourceFilePath, targetFilePath);
            break;
        case 'prepend':
            await handleFilePrepend(sourceFilePath, targetFilePath);
            break;
        default:
            console.warn(chalk.yellow(`⚠️  Unknown action '${action}' for file: ${filePath}`));
    }
}
/**
 * Handle package.json installation
 */
async function handlePackageInstallation(sourceFilePath, projectPath, packageManager, language) {
    try {
        if (await fs.pathExists(sourceFilePath)) {
            const packageData = await fs.readJson(sourceFilePath);
            const dependencies = packageData.dependencies || {};
            const devDependencies = packageData.devDependencies || {};
            const allDeps = Object.keys(dependencies);
            const allDevDeps = Object.keys(devDependencies);
            if (allDeps.length > 0 || allDevDeps.length > 0) {
                console.log(chalk.blue(`📦 Installing packages with ${packageManager}:`));
                // Install regular dependencies
                if (allDeps.length > 0) {
                    console.log(chalk.cyan(`   Dependencies: ${allDeps.join(', ')}`));
                    try {
                        await installPackages(projectPath, language || 'javascript', allDeps, {
                            isDev: false,
                            timeout: 180000 // 3 minutes timeout
                        });
                    }
                    catch (error) {
                        console.warn(chalk.yellow(`⚠️  Failed to auto-install dependencies: ${error.message}`));
                        console.log(chalk.yellow(`💡 Please install these dependencies manually:`));
                        console.log(chalk.hex('#95afc0')(`   ${getInstallCommand(packageManager, allDeps, false)}`));
                    }
                }
                // Install dev dependencies
                if (allDevDeps.length > 0) {
                    console.log(chalk.cyan(`   Dev Dependencies: ${allDevDeps.join(', ')}`));
                    try {
                        await installPackages(projectPath, language || 'javascript', allDevDeps, {
                            isDev: true,
                            timeout: 180000 // 3 minutes timeout
                        });
                    }
                    catch (error) {
                        console.warn(chalk.yellow(`   ⚠️  Failed to auto-install dev dependencies: ${error.message}`));
                        console.log(chalk.yellow(`   💡 Please install these dev dependencies manually:`));
                        console.log(chalk.hex('#95afc0')(`      ${getInstallCommand(packageManager, allDevDeps, true)}`));
                    }
                }
            }
            else {
                console.log(chalk.yellow(`⚠️  No packages found to install in: ${path.relative(process.cwd(), sourceFilePath)}`));
            }
        }
        else {
            console.warn(chalk.yellow(`⚠️  Package.json template file not found: ${path.relative(process.cwd(), sourceFilePath)}`));
            console.log(chalk.gray(`   This might be due to running a globally installed CLI. Consider using 'npx' or installing locally.`));
        }
    }
    catch (error) {
        console.warn(chalk.yellow(`⚠️  Could not install packages: ${error.message}`));
        console.log(chalk.yellow(`💡 Please install dependencies manually by checking the feature's package.json file.`));
    }
}
/**
 * Handle file creation (only if it doesn't exist)
 */
async function handleFileCreation(sourceFilePath, targetFilePath) {
    if (await fs.pathExists(targetFilePath)) {
        console.log(chalk.yellow(`⚠️  File already exists, skipping: ${path.relative(process.cwd(), targetFilePath)}`));
        return;
    }
    try {
        if (await fs.pathExists(sourceFilePath)) {
            await copyTemplateFile(sourceFilePath, targetFilePath);
            console.log(chalk.green(`✅ Created: ${path.relative(process.cwd(), targetFilePath)}`));
        }
        else {
            console.log(chalk.yellow(`⚠️  Template file not found, skipping: ${path.relative(process.cwd(), sourceFilePath)}`));
            console.log(chalk.gray(`   This might be due to running a globally installed CLI. Consider using 'npx' or installing locally.`));
        }
    }
    catch (error) {
        console.error(chalk.red(`❌ Failed to create file ${path.relative(process.cwd(), targetFilePath)}: ${error.message}`));
        throw error;
    }
}
/**
 * Handle file overwrite (replace existing content or create if doesn't exist)
 */
async function handleFileOverwrite(sourceFilePath, targetFilePath) {
    // Ensure target directory exists
    await fs.ensureDir(path.dirname(targetFilePath));
    const fileExists = await fs.pathExists(targetFilePath);
    try {
        // Check if source template exists
        if (await fs.pathExists(sourceFilePath)) {
            await copyTemplateFile(sourceFilePath, targetFilePath);
            if (fileExists) {
                console.log(chalk.green(`✅ Updated: ${path.relative(process.cwd(), targetFilePath)}`));
            }
            else {
                console.log(chalk.green(`✅ Created: ${path.relative(process.cwd(), targetFilePath)}`));
            }
        }
        else {
            console.log(chalk.yellow(`⚠️  Template file not found, skipping overwrite: ${path.relative(process.cwd(), sourceFilePath)}`));
            console.log(chalk.gray(`   This might be due to running a globally installed CLI. Consider using 'npx' or installing locally.`));
        }
    }
    catch (error) {
        console.error(chalk.red(`❌ Failed to overwrite/create ${path.relative(process.cwd(), targetFilePath)}: ${error.message}`));
        throw error;
    }
}
/**
 * Handle file append (add content to end of file, create if doesn't exist)
 */
async function handleFileAppend(sourceFilePath, targetFilePath) {
    // Ensure target directory exists
    await fs.ensureDir(path.dirname(targetFilePath));
    const fileExists = await fs.pathExists(targetFilePath);
    let existingContent = '';
    try {
        if (fileExists) {
            existingContent = await fs.readFile(targetFilePath, 'utf8');
        }
        let contentToAppend = '';
        // Check if source template exists
        if (await fs.pathExists(sourceFilePath)) {
            contentToAppend = await fs.readFile(sourceFilePath, 'utf8');
        }
        else {
            console.log(chalk.yellow(`⚠️  Template file not found, skipping append: ${path.relative(process.cwd(), sourceFilePath)}`));
            console.log(chalk.gray(`   This might be due to running a globally installed CLI. Consider using 'npx' or installing locally.`));
            return;
        }
        // Only append if the content isn't already present (avoid duplicates)
        if (!existingContent.includes(contentToAppend.trim())) {
            const separator = existingContent.endsWith('\n') || !existingContent ? '' : '\n';
            const newContent = existingContent + separator + contentToAppend;
            await fs.outputFile(targetFilePath, newContent);
            if (fileExists) {
                console.log(chalk.green(`✅ Appended to: ${path.relative(process.cwd(), targetFilePath)}`));
            }
            else {
                console.log(chalk.green(`✅ Created with content: ${path.relative(process.cwd(), targetFilePath)}`));
            }
        }
        else {
            console.log(chalk.yellow(`⚠️  Content already exists in file, skipping append: ${path.relative(process.cwd(), targetFilePath)}`));
        }
    }
    catch (error) {
        console.error(chalk.red(`❌ Failed to append/create ${path.relative(process.cwd(), targetFilePath)}: ${error.message}`));
        throw error;
    }
}
/**
 * Handle file prepend (add content to beginning of file, create if doesn't exist)
 */
async function handleFilePrepend(sourceFilePath, targetFilePath) {
    // Ensure target directory exists
    await fs.ensureDir(path.dirname(targetFilePath));
    const fileExists = await fs.pathExists(targetFilePath);
    let existingContent = '';
    try {
        if (fileExists) {
            existingContent = await fs.readFile(targetFilePath, 'utf-8');
        }
        let templateContent;
        // Check if source template exists
        if (await fs.pathExists(sourceFilePath)) {
            templateContent = await fs.readFile(sourceFilePath, 'utf-8');
        }
        else {
            console.log(chalk.yellow(`⚠️  Template file not found, skipping prepend: ${path.relative(process.cwd(), sourceFilePath)}`));
            console.log(chalk.gray(`   This might be due to running a globally installed CLI. Consider using 'npx' or installing locally.`));
            return;
        }
        // Only prepend if the content isn't already present (avoid duplicates)
        if (!existingContent.includes(templateContent.trim())) {
            const separator = templateContent.endsWith('\n') ? '' : '\n';
            const newContent = templateContent + separator + existingContent;
            await fs.outputFile(targetFilePath, newContent);
            if (fileExists) {
                console.log(chalk.green(`✅ Prepended to: ${path.relative(process.cwd(), targetFilePath)}`));
            }
            else {
                console.log(chalk.green(`✅ Created with content: ${path.relative(process.cwd(), targetFilePath)}`));
            }
        }
        else {
            console.log(chalk.yellow(`⚠️  Content already exists in file, skipping prepend: ${path.relative(process.cwd(), targetFilePath)}`));
        }
    }
    catch (error) {
        console.error(chalk.red(`❌ Failed to prepend/create ${path.relative(process.cwd(), targetFilePath)}: ${error.message}`));
        throw error;
    }
}
/**
 * Copy template file to target location with framework-agnostic content processing
 */
async function copyTemplateFile(sourceFilePath, targetFilePath) {
    if (!await fs.pathExists(sourceFilePath)) {
        const relativePath = path.relative(process.cwd(), sourceFilePath);
        console.error(chalk.red(`❌ Template file not found: ${relativePath}`));
        console.error(chalk.yellow(`💡 This might be due to running a globally installed CLI. Consider using 'npx' or installing locally.`));
        throw new Error(`Template file not found: ${sourceFilePath}`);
    }
    try {
        // Ensure target directory exists
        await fs.ensureDir(path.dirname(targetFilePath));
        // For code files, we might need to adjust import paths based on project structure
        if (path.extname(sourceFilePath).match(/\.(js|jsx|ts|tsx)$/)) {
            const templateContent = await fs.readFile(sourceFilePath, 'utf-8');
            // Process content based on project structure (framework-agnostic)
            let processedContent = templateContent;
            // Adjust import paths for src-based project structures
            if (targetFilePath.includes('/src/')) {
                processedContent = processedContent.replace(/from ['"]@\//g, 'from "@/');
                processedContent = processedContent.replace(/from ['"]\.\.\//g, 'from "../');
            }
            await fs.writeFile(targetFilePath, processedContent);
        }
        else {
            // For non-code files, just copy directly
            await fs.copy(sourceFilePath, targetFilePath);
        }
    }
    catch (error) {
        console.error(chalk.red(`❌ Failed to copy template file: ${error}`));
        throw error;
    }
}
/**
 * Show setup instructions for a feature
 */
function showSetupInstructions(featureName, provider) {
    console.log(`\n${chalk.hex('#00d2d3')('📋 Setup Instructions:')}`);
    switch (featureName) {
        case 'auth':
            if (provider === 'clerk') {
                console.log(chalk.hex('#95afc0')('1. Sign up at https://clerk.com'));
                console.log(chalk.hex('#95afc0')('2. Get your API keys from the dashboard'));
                console.log(chalk.hex('#95afc0')('3. Add them to your .env file'));
            }
            else if (provider === 'auth0') {
                console.log(chalk.hex('#95afc0')('1. Sign up at https://auth0.com'));
                console.log(chalk.hex('#95afc0')('2. Create an application and get your domain/client ID'));
                console.log(chalk.hex('#95afc0')('3. Configure your .env file'));
            }
            else if (provider === 'next-auth') {
                console.log(chalk.hex('#95afc0')('1. Configure providers in your auth config'));
                console.log(chalk.hex('#95afc0')('2. Set NEXTAUTH_SECRET in .env'));
                console.log(chalk.hex('#95afc0')('3. Add provider client IDs/secrets'));
            }
            break;
        case 'database':
            console.log(chalk.hex('#95afc0')('1. Set up your database connection'));
            console.log(chalk.hex('#95afc0')('2. Update connection string in .env'));
            console.log(chalk.hex('#95afc0')('3. Run migrations if needed'));
            break;
        case 'docker':
            console.log(chalk.hex('#95afc0')('1. Install Docker on your system'));
            console.log(chalk.hex('#95afc0')('2. Run: docker-compose up -d'));
            console.log(chalk.hex('#95afc0')('3. Your app will be available at the configured port'));
            break;
        default:
            console.log(chalk.hex('#95afc0')(`Check the documentation for ${featureName} configuration`));
    }
}
/**
 * Generate the correct install command for different package managers
 */
function getInstallCommand(packageManager, packages, isDev) {
    switch (packageManager) {
        case 'npm':
            return `npm install ${isDev ? '--save-dev' : ''} ${packages.join(' ')}`;
        case 'yarn':
            return `yarn add ${isDev ? '--dev' : ''} ${packages.join(' ')}`;
        case 'pnpm':
            return `pnpm add ${isDev ? '--save-dev' : ''} ${packages.join(' ')}`;
        case 'bun':
            return `bun add ${isDev ? '--dev' : ''} ${packages.join(' ')}`;
        case 'gem':
            return `gem install ${packages.join(' ')}`;
        case 'pip':
            return `pip install ${packages.join(' ')}`;
        default:
            return `npm install ${isDev ? '--save-dev' : ''} ${packages.join(' ')}`;
    }
}
