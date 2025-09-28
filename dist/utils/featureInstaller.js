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
import { cacheProjectData, getCachedProject } from './cacheManager.js';
import { getCliRootPath, getFeaturesJsonPath } from './pathResolver.js';
// Get the directory of this file for proper path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load supported features from cached or direct file access
let SUPPORTED_FEATURES = {};
/**
 * Load features from cache or file system
 */
async function loadFeatures() {
    try {
        // Get CLI installation directory using the centralized path resolver
        const featuresPath = getFeaturesJsonPath();
        if (await fs.pathExists(featuresPath)) {
            const featuresData = await fs.readJson(featuresPath);
            SUPPORTED_FEATURES = featuresData.features || featuresData;
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
        // Check if src folder exists and contains typical Next.js folders
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
        // Check for components directory in src (common pattern)
        const srcComponentsPath = path.join(srcPath, 'components');
        if (await fs.pathExists(srcComponentsPath)) {
            return true;
        }
        return false;
    }
    catch (error) {
        return false;
    }
}
/**
 * Adjust file path for Next.js src folder structure (Next.js only)
 * Dynamically places files in src/ folder based on their path structure
 */
function adjustNextjsSrcFilePath(filePath, hasSrcFolder, projectPath) {
    // If project doesn't use src folder, return original path
    if (!hasSrcFolder) {
        return path.join(projectPath, filePath);
    }
    // Files that should ALWAYS be in root regardless of src folder
    const rootOnlyFiles = [
        '.env',
        '.env.local',
        '.env.example',
        'package.json',
        'next.config.js',
        'next.config.mjs',
        'tailwind.config.js',
        'tailwind.config.ts',
        'postcss.config.js',
        'middleware.ts',
        'middleware.js'
    ];
    const fileName = path.basename(filePath);
    // Check if this file should always be in root
    if (rootOnlyFiles.includes(fileName) || filePath.startsWith('public/')) {
        return path.join(projectPath, filePath);
    }
    // For all other files, place them in src/ folder if src structure is used
    return path.join(projectPath, 'src', filePath);
}
export async function detectProjectStack(projectPath) {
    try {
        // Check cache first
        const cachedProject = await getCachedProject(projectPath);
        if (cachedProject) {
            const packageManager = await detectPackageManager(projectPath);
            let hasSrcFolder = await fs.pathExists(path.join(projectPath, 'src'));
            // For Next.js projects, do a more thorough src folder detection
            if (cachedProject.framework === 'nextjs') {
                hasSrcFolder = await detectNextjsSrcStructure(projectPath);
            }
            return {
                framework: cachedProject.framework,
                language: cachedProject.language,
                projectLanguage: cachedProject.language,
                packageManager,
                hasSrcFolder
            };
        }
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
            await cacheProjectData(projectPath, packageJson.name || path.basename(projectPath), typeof projectLanguage === 'string' ? projectLanguage : 'unknown', framework, Object.keys(dependencies), 0);
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
        // Get project information
        const projectInfo = await detectProjectStack(projectPath);
        if (!projectInfo.framework) {
            throw new Error('Could not detect project framework');
        }
        // Get feature configuration
        const featureConfig = SUPPORTED_FEATURES[featureName];
        if (!featureConfig) {
            throw new Error(`Feature '${featureName}' not found in features.json`);
        }
        // Check if feature supports this framework
        if (!featureConfig.supportedFrameworks.includes(projectInfo.framework)) {
            throw new Error(`Feature '${featureName}' is not supported for ${projectInfo.framework} projects`);
        }
        // For features with providers (like auth), prompt for provider selection
        let selectedProvider = provider;
        if (!selectedProvider && featureConfig.files) {
            const availableProviders = Object.keys(featureConfig.files);
            if (availableProviders.length > 1) {
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
            }
            else {
                selectedProvider = availableProviders[0];
            }
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
    }
    catch (error) {
        spinner.fail(chalk.red(`❌ Failed to add ${featureName} feature: ${error.message}`));
        throw error;
    }
}
/**
 * Get feature files for a specific provider, framework, and language
 */
function getFeatureFiles(featureConfig, provider, framework, language) {
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
 * Process a single feature file based on its action
 */
async function processFeatureFile(filePath, fileConfig, featureName, provider, projectInfo, projectPath) {
    const { action } = fileConfig;
    // Try to get template content from file system
    let sourceContent = null;
    // Get the CLI root path for accessing feature templates
    const cliRoot = getCliRootPath();
    const featureTemplatePath = path.join(cliRoot, 'features', featureName, provider, projectInfo.framework, projectInfo.projectLanguage);
    const sourceFilePath = path.join(featureTemplatePath, filePath);
    // Load from file system
    if (await fs.pathExists(sourceFilePath)) {
        sourceContent = await fs.readFile(sourceFilePath, 'utf-8');
    }
    // Handle file path adjustment based on project structure
    let targetFilePath = path.join(projectPath, filePath);
    // For Next.js projects with src folder structure, adjust file paths accordingly
    if (projectInfo.framework === 'nextjs' && projectInfo.hasSrcFolder) {
        targetFilePath = adjustNextjsSrcFilePath(filePath, projectInfo.hasSrcFolder, projectPath);
    }
    // Ensure all parent directories exist before processing
    await fs.ensureDir(path.dirname(targetFilePath));
    switch (action) {
        case 'install':
            await handlePackageInstallation(sourceFilePath, projectPath, projectInfo.packageManager || 'npm');
            break;
        case 'create':
            await handleFileCreation(sourceFilePath, targetFilePath, sourceContent);
            break;
        case 'overwrite':
            await handleFileOverwrite(sourceFilePath, targetFilePath, sourceContent);
            break;
        case 'append':
            await handleFileAppend(sourceFilePath, targetFilePath, sourceContent);
            break;
        case 'prepend':
            await handleFilePrepend(sourceFilePath, targetFilePath, sourceContent);
            break;
        default:
            console.warn(chalk.yellow(`⚠️  Unknown action '${action}' for file: ${filePath}`));
    }
}
/**
 * Handle package.json installation
 */
async function handlePackageInstallation(sourceFilePath, projectPath, packageManager) {
    try {
        if (await fs.pathExists(sourceFilePath)) {
            const packageData = await fs.readJson(sourceFilePath);
            const dependencies = packageData.dependencies || {};
            const devDependencies = packageData.devDependencies || {};
            const allDeps = { ...dependencies, ...devDependencies };
            const depNames = Object.keys(allDeps);
            if (depNames.length > 0) {
                console.log(chalk.blue(`📦 Installing packages: ${depNames.join(', ')}`));
                await installPackages(projectPath, 'javascript', depNames);
            }
        }
    }
    catch (error) {
        console.warn(chalk.yellow(`⚠️  Could not install packages: ${error.message}`));
    }
}
/**
 * Handle file creation (only if it doesn't exist)
 */
async function handleFileCreation(sourceFilePath, targetFilePath, cachedContent) {
    if (await fs.pathExists(targetFilePath)) {
        console.log(chalk.yellow(`⚠️  File already exists, skipping: ${path.relative(process.cwd(), targetFilePath)}`));
        return;
    }
    if (cachedContent) {
        await fs.outputFile(targetFilePath, cachedContent);
    }
    else {
        await copyTemplateFile(sourceFilePath, targetFilePath);
    }
    console.log(chalk.green(`✅ Created: ${path.relative(process.cwd(), targetFilePath)}`));
}
/**
 * Handle file overwrite (replace existing content or create if doesn't exist)
 */
async function handleFileOverwrite(sourceFilePath, targetFilePath, cachedContent) {
    // Ensure target directory exists
    await fs.ensureDir(path.dirname(targetFilePath));
    const fileExists = await fs.pathExists(targetFilePath);
    try {
        if (cachedContent) {
            await fs.outputFile(targetFilePath, cachedContent);
        }
        else {
            // Check if source template exists
            if (await fs.pathExists(sourceFilePath)) {
                await copyTemplateFile(sourceFilePath, targetFilePath);
            }
            else {
                console.log(chalk.yellow(`⚠️  Template file not found, skipping: ${path.relative(process.cwd(), sourceFilePath)}`));
                console.log(chalk.gray(`   This might be due to running a globally installed CLI. Consider using 'npx' or installing locally.`));
                return;
            }
        }
        if (fileExists) {
            console.log(chalk.green(`✅ Updated: ${path.relative(process.cwd(), targetFilePath)}`));
        }
        else {
            console.log(chalk.green(`✅ Created: ${path.relative(process.cwd(), targetFilePath)}`));
        }
    }
    catch (error) {
        console.error(chalk.red(`❌ Failed to overwrite/create ${path.relative(process.cwd(), targetFilePath)}: ${error}`));
        throw error;
    }
}
/**
 * Handle file append (add content to end of file, create if doesn't exist)
 */
async function handleFileAppend(sourceFilePath, targetFilePath, cachedContent) {
    // Ensure target directory exists
    await fs.ensureDir(path.dirname(targetFilePath));
    const fileExists = await fs.pathExists(targetFilePath);
    let existingContent = '';
    try {
        if (fileExists) {
            existingContent = await fs.readFile(targetFilePath, 'utf8');
        }
        let contentToAppend = '';
        if (cachedContent) {
            contentToAppend = cachedContent;
        }
        else {
            // Check if source template exists
            if (await fs.pathExists(sourceFilePath)) {
                contentToAppend = await fs.readFile(sourceFilePath, 'utf8');
            }
            else {
                console.log(chalk.yellow(`⚠️  Template file not found, skipping append: ${path.relative(process.cwd(), sourceFilePath)}`));
                console.log(chalk.gray(`   This might be due to running a globally installed CLI. Consider using 'npx' or installing locally.`));
                return;
            }
        }
        const newContent = existingContent + contentToAppend;
        await fs.outputFile(targetFilePath, newContent);
        if (fileExists) {
            console.log(chalk.green(`✅ Appended to: ${path.relative(process.cwd(), targetFilePath)}`));
        }
        else {
            console.log(chalk.green(`✅ Created with content: ${path.relative(process.cwd(), targetFilePath)}`));
        }
    }
    catch (error) {
        console.error(chalk.red(`❌ Failed to append/create ${path.relative(process.cwd(), targetFilePath)}: ${error}`));
        throw error;
    }
}
/**
 * Handle file prepend (add content to beginning of file, create if doesn't exist)
 */
async function handleFilePrepend(sourceFilePath, targetFilePath, cachedContent) {
    // Ensure target directory exists
    await fs.ensureDir(path.dirname(targetFilePath));
    const fileExists = await fs.pathExists(targetFilePath);
    let existingContent = '';
    try {
        if (fileExists) {
            existingContent = await fs.readFile(targetFilePath, 'utf-8');
        }
        let templateContent;
        if (cachedContent) {
            templateContent = cachedContent;
        }
        else {
            // Check if source template exists
            if (await fs.pathExists(sourceFilePath)) {
                templateContent = await fs.readFile(sourceFilePath, 'utf-8');
            }
            else {
                console.log(chalk.yellow(`⚠️  Template file not found, skipping prepend: ${path.relative(process.cwd(), sourceFilePath)}`));
                console.log(chalk.gray(`   This might be due to running a globally installed CLI. Consider using 'npx' or installing locally.`));
                return;
            }
        }
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
    catch (error) {
        console.error(chalk.red(`❌ Failed to prepend/create ${path.relative(process.cwd(), targetFilePath)}: ${error}`));
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
