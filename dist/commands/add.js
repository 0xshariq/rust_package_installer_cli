import chalk from 'chalk';
import inquirer from 'inquirer';
import gradient from 'gradient-string';
import boxen from 'boxen';
import path from 'path';
import fs from 'fs-extra';
import { addFeature, detectProjectStack, SUPPORTED_FEATURES } from '../utils/featureInstaller.js';
import { historyManager } from '../utils/historyManager.js';
import { getCachedProject, cacheProjectData } from '../utils/cacheManager.js';
import { getFeaturesJsonPath, getFeaturesPath } from '../utils/pathResolver.js';
/**
 * Helper function to capitalize strings
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Get features.json configuration
 */
function getFeaturesConfig() {
    try {
        // Use the centralized path resolver
        const featuresPath = getFeaturesJsonPath();
        if (fs.existsSync(featuresPath)) {
            return JSON.parse(fs.readFileSync(featuresPath, 'utf-8'));
        }
        console.warn(chalk.yellow(`⚠️  features.json not found at: ${featuresPath}`));
        return { features: {} };
    }
    catch (error) {
        console.warn(chalk.yellow('⚠️  Error reading features.json, using fallback'));
        return { features: {} };
    }
}
/**
 * Get available feature categories
 */
function getAvailableFeatures() {
    const config = getFeaturesConfig();
    return Object.keys(config);
}
/**
 * Get sub-features for a category
 */
function getSubFeatures(category) {
    const config = getFeaturesConfig();
    const categoryConfig = config[category];
    if (!categoryConfig || typeof categoryConfig !== 'object') {
        return [];
    }
    return Object.keys(categoryConfig);
}
/**
 * List available features from features.json with descriptions
 */
function listAvailableFeatures() {
    const featuresConfig = getFeaturesConfig();
    if (!featuresConfig.features || Object.keys(featuresConfig.features).length === 0) {
        console.log(chalk.yellow('⚠️  No features found in configuration'));
        return;
    }
    const featuresData = Object.entries(featuresConfig.features).map(([key, config]) => {
        const providers = Object.keys(config).filter(k => k !== 'description' && k !== 'supportedFrameworks');
        const description = config.description || 'No description available';
        const frameworks = config.supportedFrameworks ? config.supportedFrameworks.join(', ') : 'All frameworks';
        return {
            name: key,
            description,
            providers: providers.length > 0 ? providers : ['No providers'],
            frameworks,
            status: providers.length > 0 ? '✅' : '🚧'
        };
    });
    console.log('\n' + boxen(gradient(['#4facfe', '#00f2fe'])('🔮 Available Features') + '\n\n' +
        featuresData.map(feature => {
            const providersList = feature.providers.join(', ');
            return `${feature.status} ${chalk.bold.cyan(feature.name)}\n  ${chalk.gray(feature.description)}\n  ${chalk.dim('Providers: ' + providersList)}\n  ${chalk.dim('Frameworks: ' + feature.frameworks)}`;
        }).join('\n\n'), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan'
    }));
}
/**
 * Display important disclaimer about potential issues
 */
function showFeatureDisclaimer() {
    const disclaimerBox = boxen(chalk.yellow.bold('⚠️  IMPORTANT DISCLAIMER') + '\n\n' +
        chalk.white('When adding features to your project:') + '\n' +
        chalk.gray('• Syntax errors may occur during integration') + '\n' +
        chalk.gray('• Code formatting issues might arise') + '\n' +
        chalk.gray('• Manual adjustments may be required') + '\n' +
        chalk.gray('• Always backup your project before adding features') + '\n\n' +
        chalk.cyan('💡 It\'s recommended to test your project after feature integration'), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'yellow',
        title: 'Feature Integration Warning',
        titleAlignment: 'center'
    });
    console.log(disclaimerBox);
}
/**
 * Prompt for feature category selection
 */
async function promptFeatureCategory(availableFeatures) {
    const { feature } = await inquirer.prompt([
        {
            type: 'list',
            name: 'feature',
            message: `${chalk.blue('❯')} Choose a feature category to add:`,
            choices: availableFeatures.map(feature => ({
                name: `${chalk.green('▸')} ${capitalize(feature)}`,
                value: feature,
                short: feature
            })),
            pageSize: 12
        }
    ]);
    return feature;
}
/**
 * Prompt for feature provider selection
 */
async function promptFeatureProvider(category, providers) {
    const { provider } = await inquirer.prompt([
        {
            type: 'list',
            name: 'provider',
            message: `${chalk.blue('❯')} Choose a ${category} provider:`,
            choices: providers.map(provider => ({
                name: `${chalk.green('▸')} ${capitalize(provider.replace(/-/g, ' '))}`,
                value: provider,
                short: provider
            })),
            pageSize: 10
        }
    ]);
    return provider;
}
/**
 * Get available providers for a feature from features.json
 */
function getFeatureProviders(feature, featureConfig) {
    if (!featureConfig.files)
        return [];
    return Object.keys(featureConfig.files);
}
/**
 * Check if framework is supported for a feature
 */
function isFrameworkSupported(featureConfig, framework) {
    if (!featureConfig.supportedFrameworks)
        return true;
    return featureConfig.supportedFrameworks.includes(framework);
}
/**
 * Show enhanced setup instructions for specific features
 */
function showEnhancedSetupInstructions(feature, provider) {
    console.log(chalk.green(`\n🔧 Setup Instructions for ${chalk.bold(provider)} (${feature}):`));
    switch (feature) {
        case 'auth':
            console.log(chalk.hex('#95afc0')('1. Configure authentication provider credentials'));
            console.log(chalk.hex('#95afc0')('2. Add environment variables to .env file'));
            console.log(chalk.hex('#95afc0')('3. Set up authentication routes and middleware'));
            console.log(chalk.hex('#95afc0')('4. Update your app configuration'));
            break;
        case 'ai':
            console.log(chalk.hex('#95afc0')('1. Get API key from your AI provider'));
            console.log(chalk.hex('#95afc0')('2. Add API key to .env file'));
            console.log(chalk.hex('#95afc0')('3. Test AI integration endpoints'));
            console.log(chalk.hex('#95afc0')('4. Configure rate limiting and error handling'));
            break;
        case 'database':
            console.log(chalk.hex('#95afc0')('1. Set up your database connection'));
            console.log(chalk.hex('#95afc0')('2. Update connection string in .env'));
            console.log(chalk.hex('#95afc0')('3. Run migrations if needed'));
            console.log(chalk.hex('#95afc0')('4. Test database connectivity'));
            break;
        case 'aws':
            console.log(chalk.hex('#95afc0')('1. Configure AWS credentials (AWS CLI or IAM roles)'));
            console.log(chalk.hex('#95afc0')('2. Set up required AWS permissions'));
            console.log(chalk.hex('#95afc0')('3. Update AWS region in configuration'));
            console.log(chalk.hex('#95afc0')('4. Test AWS service integration'));
            break;
        case 'payment':
            console.log(chalk.hex('#95afc0')('1. Get API keys from payment provider'));
            console.log(chalk.hex('#95afc0')('2. Add keys to .env file (separate test/live keys)'));
            console.log(chalk.hex('#95afc0')('3. Configure webhooks for payment events'));
            console.log(chalk.hex('#95afc0')('4. Test payment flow in sandbox mode'));
            break;
        case 'storage':
            console.log(chalk.hex('#95afc0')('1. Configure storage provider credentials'));
            console.log(chalk.hex('#95afc0')('2. Set up bucket/container permissions'));
            console.log(chalk.hex('#95afc0')('3. Add storage configuration to .env'));
            console.log(chalk.hex('#95afc0')('4. Test file upload/download functionality'));
            break;
        case 'monitoring':
            console.log(chalk.hex('#95afc0')('1. Get monitoring service API key'));
            console.log(chalk.hex('#95afc0')('2. Add configuration to .env file'));
            console.log(chalk.hex('#95afc0')('3. Set up error tracking and alerts'));
            console.log(chalk.hex('#95afc0')('4. Configure performance monitoring'));
            break;
        case 'analytics':
            console.log(chalk.hex('#95afc0')('1. Get analytics service tracking ID'));
            console.log(chalk.hex('#95afc0')('2. Add tracking configuration'));
            console.log(chalk.hex('#95afc0')('3. Set up custom events and goals'));
            console.log(chalk.hex('#95afc0')('4. Verify data collection'));
            break;
        case 'docker':
            console.log(chalk.hex('#95afc0')('1. Install Docker on your system'));
            console.log(chalk.hex('#95afc0')('2. Run: docker-compose up -d'));
            console.log(chalk.hex('#95afc0')('3. Your app will be available at the configured port'));
            console.log(chalk.hex('#95afc0')('4. Check logs: docker-compose logs'));
            break;
        case 'testing':
            console.log(chalk.hex('#95afc0')('1. Configure test environment variables'));
            console.log(chalk.hex('#95afc0')('2. Set up test database/services'));
            console.log(chalk.hex('#95afc0')('3. Run tests: npm test'));
            console.log(chalk.hex('#95afc0')('4. Set up CI/CD test automation'));
            break;
        default:
            console.log(chalk.hex('#95afc0')(`1. Check the ${feature} configuration files`));
            console.log(chalk.hex('#95afc0')('2. Update .env file with necessary variables'));
            console.log(chalk.hex('#95afc0')('3. Test the integration'));
            console.log(chalk.hex('#95afc0')('4. Review documentation for advanced setup'));
    }
    console.log(chalk.hex('#95afc0')('\n💡 Check your project files for any additional setup instructions'));
    console.log(chalk.hex('#95afc0')('🔗 Refer to the provider\'s official documentation for detailed configuration'));
}
/**
 * Show help for add command
 */
export function showAddHelp() {
    const piGradient = gradient(['#00c6ff', '#0072ff']);
    const featuresConfig = getFeaturesConfig();
    const availableFeatures = Object.keys(featuresConfig.features || {});
    console.log('\n' + boxen(piGradient.multiline([
        '📦 Package Installer CLI - Add Features',
        '',
        'USAGE:',
        '  pi add                         # Interactive feature selection',
        '  pi add <feature>               # Add feature with provider selection',
        '  pi add <feature> <provider>    # Add specific feature provider',
        '  pi add --list                  # List all available features',
        '  pi add --help                  # Show this help message',
        '',
        'EXAMPLES:',
        '  pi add                         # Show all features in dropdown',
        '  pi add auth                    # Show auth providers dropdown',
        '  pi add auth clerk              # Add Clerk authentication',
        '  pi add aws                     # Show AWS services dropdown',
        '  pi add aws ec2                 # Add AWS EC2 integration',
        '  pi add ai openai               # Add OpenAI integration',
        '  pi add database postgres       # Add PostgreSQL integration',
        '  pi add payment stripe          # Add Stripe payment integration',
        '',
        'OPTIONS:',
        '  -l, --list                     List all available features',
        '  -v, --verbose                  Show detailed output',
        '  -h, --help                     Show this help message',
        '',
        `AVAILABLE FEATURES (${availableFeatures.length}):`,
        availableFeatures.length > 0
            ? availableFeatures.map(feature => `  • ${feature}`).join('\n')
            : '  No features configured',
        '',
        'SUPPORTED FRAMEWORKS:',
        '  • Next.js                      App Router & Pages Router',
        '  • React                        Create React App & Vite',
        '  • Express.js                   Node.js backend framework',
        '  • NestJS                       TypeScript backend framework',
        '  • Vue.js                       Vue 3 with Composition API',
        '  • Angular                      Angular 15+',
        '  • Remix                        Full-stack React framework',
        '  • And more coming soon...',
        '',
        'NOTES:',
        '  • Features are automatically configured for your framework',
        '  • Environment variables are added to .env files',
        '  • TypeScript and JavaScript are both supported',
        '  • Use "pi add --list" to see detailed feature information'
    ].join('\n')), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'blue'
    }));
}
/**
 * Main add command handler with enhanced syntax support
 * Supports:
 * - pi add (interactive dropdown)
 * - pi add <category> (show providers for category)
 * - pi add <category> <provider> (direct installation)
 * - pi add --list (list all available features)
 * - pi add --help (show help information)
 */
export async function addCommand(feature, provider, options = {}) {
    try {
        // Handle help flag
        if (options.help || feature === '--help' || feature === '-h') {
            showAddHelp();
            return;
        }
        // Handle list flag
        if (options.list || feature === '--list' || feature === '-l') {
            listAvailableFeatures();
            return;
        }
        // Initialize history manager
        await historyManager.init();
        // Show disclaimer
        showFeatureDisclaimer();
        console.log(chalk.hex('#9c88ff')('\n🔮 Adding features to your project...'));
        // Use provided project path or current directory
        const projectPath = options.projectPath || process.cwd();
        let projectInfo;
        // If framework is provided (from create command), use it directly
        if (options.framework) {
            console.log(chalk.green(`✅ Using ${options.framework} framework (from project creation)`));
            projectInfo = {
                framework: options.framework,
                projectLanguage: 'typescript', // Default, can be improved
                language: 'typescript'
            };
        }
        else {
            // Standalone add command - detect framework from project files
            projectInfo = await getCachedProject(projectPath);
            if (!projectInfo) {
                console.log(chalk.yellow('🔍 Analyzing project structure...'));
                projectInfo = await detectProjectStack(projectPath);
                // Cache the detected project info
                if (projectInfo.framework && projectInfo.language) {
                    try {
                        const packageJsonPath = path.join(projectPath, 'package.json');
                        const projectName = await fs.pathExists(packageJsonPath)
                            ? (await fs.readJson(packageJsonPath)).name || path.basename(projectPath)
                            : path.basename(projectPath);
                        await cacheProjectData(projectPath, projectName, projectInfo.projectLanguage || 'unknown', projectInfo.framework, [], 0);
                    }
                    catch (error) {
                        console.warn(chalk.yellow('⚠️  Could not cache project info'));
                    }
                }
            }
            if (!projectInfo || !projectInfo.framework) {
                console.log(chalk.red('❌ No supported framework detected in current directory'));
                console.log(chalk.yellow('💡 Supported frameworks: Next.js, React, Express, NestJS, Vue, Angular, Remix'));
                console.log(chalk.yellow('💡 Make sure you\'re in a project root with package.json'));
                // Show detected files for debugging
                const files = await fs.readdir(projectPath);
                const relevantFiles = files.filter(f => f.endsWith('.json') || f.startsWith('package') || f.startsWith('tsconfig'));
                if (relevantFiles.length > 0) {
                    console.log(chalk.gray(`📁 Found files: ${relevantFiles.join(', ')}`));
                }
                return;
            }
            console.log(chalk.green(`✅ Detected ${projectInfo.framework} project (${projectInfo.projectLanguage || projectInfo.language})`));
        }
        // Validate that framework features exist in features directory
        const frameworkFeaturesPath = getFeaturesPath();
        if (!await fs.pathExists(frameworkFeaturesPath)) {
            console.log(chalk.red('❌ Features directory not found'));
            console.log(chalk.yellow('💡 Make sure you\'re running this from the Package Installer CLI root directory'));
            return;
        }
        // Load features configuration
        const featuresConfigPath = getFeaturesJsonPath();
        if (!await fs.pathExists(featuresConfigPath)) {
            console.log(chalk.red('❌ Features configuration not found'));
            return;
        }
        const featuresConfig = JSON.parse(await fs.readFile(featuresConfigPath, 'utf-8'));
        const availableFeatures = Object.keys(featuresConfig.features);
        // Handle different command syntax cases
        if (!feature) {
            // Case 1: "pi add" - Show interactive dropdown for all features
            const selectedFeature = await promptFeatureCategory(availableFeatures);
            if (!selectedFeature)
                return;
            feature = selectedFeature;
        }
        // Validate feature exists
        if (!availableFeatures.includes(feature)) {
            console.log(chalk.red(`❌ Feature '${feature}' not found`));
            console.log(chalk.yellow(`💡 Available features: ${availableFeatures.join(', ')}`));
            return;
        }
        const currentFeatureConfig = featuresConfig.features[feature];
        if (!provider) {
            // Case 2: "pi add <category>" - Show providers for category
            const providers = getFeatureProviders(feature, currentFeatureConfig);
            if (providers.length === 0) {
                console.log(chalk.yellow(`⚠️  No providers found for ${feature}`));
                return;
            }
            if (providers.length === 1) {
                provider = providers[0];
                console.log(chalk.cyan(`🔧 Using ${chalk.bold(provider)} (only provider available)`));
            }
            else {
                const selectedProvider = await promptFeatureProvider(feature, providers);
                if (!selectedProvider)
                    return;
                provider = selectedProvider;
            }
        }
        // Case 3: "pi add <category> <provider>" - Direct installation
        // Validate provider exists for feature
        const providers = getFeatureProviders(feature, currentFeatureConfig);
        if (!providers.includes(provider)) {
            console.log(chalk.red(`❌ Provider '${provider}' not found for ${feature}`));
            console.log(chalk.yellow(`💡 Available providers: ${providers.join(', ')}`));
            return;
        }
        // Check framework compatibility
        if (!isFrameworkSupported(currentFeatureConfig, projectInfo.framework)) {
            console.log(chalk.red(`❌ ${feature} (${provider}) is not supported for ${projectInfo.framework}`));
            console.log(chalk.yellow(`💡 Supported frameworks: ${currentFeatureConfig.supportedFrameworks?.join(', ') || 'Not specified'}`));
            return;
        }
        // Install the feature
        console.log(chalk.hex('#00d2d3')(`\n🚀 Installing ${feature} (${provider})...\n`));
        try {
            await addFeature(feature, provider, projectPath);
            console.log(chalk.green(`\n✅ Successfully added ${feature} (${provider})`));
            // Show setup instructions
            showEnhancedSetupInstructions(feature, provider);
            // Update history (if available)
            try {
                if ('addFeature' in historyManager && typeof historyManager.addFeature === 'function') {
                    await historyManager.addFeature(feature, provider, projectPath);
                }
            }
            catch (error) {
                // History update is optional
            }
        }
        catch (error) {
            console.log(chalk.red(`\n❌ Failed to add ${feature} (${provider}): ${error}`));
        }
        // Show additional project details
        if (projectInfo.packageManager) {
            console.log(chalk.gray(`📦 Package manager: ${projectInfo.packageManager}`));
        }
        if (projectInfo.hasSrcFolder) {
            console.log(chalk.gray(`📁 Source structure: src folder detected`));
        }
        let selectedFeature = feature;
        let selectedProvider = provider;
        // If no feature specified, show interactive selection
        if (!selectedFeature) {
            const availableFeatures = Object.keys(SUPPORTED_FEATURES).filter(key => {
                const featureConfig = SUPPORTED_FEATURES[key];
                const frameworkSupported = featureConfig.supportedFrameworks.includes(projectInfo.framework);
                const projectLang = projectInfo.projectLanguage || projectInfo.language || 'javascript';
                const languageSupported = featureConfig.supportedLanguages.includes(projectLang);
                return frameworkSupported && languageSupported;
            });
            if (availableFeatures.length === 0) {
                console.log(chalk.yellow(`⚠️  No features available for ${projectInfo.framework} projects`));
                return;
            }
            const choices = availableFeatures.map(key => {
                const config = SUPPORTED_FEATURES[key];
                const isComingSoon = Object.keys(config.files || {}).length === 0;
                const status = isComingSoon ? chalk.hex('#95afc0')(' (Coming Soon)') : '';
                const description = config.description || 'No description available';
                return {
                    name: `${chalk.bold.cyan(key)}${status}\n  ${chalk.gray(description)}`,
                    value: key,
                    disabled: isComingSoon
                };
            });
            const { feature: chosenFeature } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'feature',
                    message: chalk.hex('#9c88ff')('🚀 Select a feature to add:'),
                    choices,
                    pageSize: 10
                }
            ]);
            selectedFeature = chosenFeature;
        }
        // Check if feature exists and is supported
        if (!SUPPORTED_FEATURES[selectedFeature]) {
            console.log(chalk.red(`❌ Feature '${selectedFeature}' not found`));
            console.log(chalk.yellow('💡 Use "pi add --list" to see available features'));
            return;
        }
        const featureConfig = SUPPORTED_FEATURES[selectedFeature];
        // Check framework and language support
        if (!featureConfig.supportedFrameworks.includes(projectInfo.framework)) {
            console.log(chalk.red(`❌ Feature '${selectedFeature}' is not supported for ${projectInfo.framework} projects`));
            return;
        }
        if (!featureConfig.supportedLanguages.includes(projectInfo.projectLanguage || projectInfo.language || 'javascript')) {
            console.log(chalk.red(`❌ Feature '${selectedFeature}' is not supported for ${projectInfo.projectLanguage || projectInfo.language} projects`));
            return;
        }
        // Check if feature is coming soon
        if (Object.keys(featureConfig.files || {}).length === 0) {
            console.log(chalk.hex('#ffa502')(`🚧 ${selectedFeature} is coming soon!`));
            console.log(chalk.hex('#95afc0')('Stay tuned for updates.'));
            return;
        }
        // Get available sub-features/providers
        const subFeatures = getSubFeatures(selectedFeature);
        // If no provider specified and multiple providers available, show selection
        if (!selectedProvider && subFeatures.length > 1) {
            const providerChoices = subFeatures.map((subFeature) => {
                // Try to get provider description or use formatted name
                const formattedName = subFeature
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                return {
                    name: `${chalk.bold.green(formattedName)} - ${getProviderDescription(selectedFeature, subFeature)}`,
                    value: subFeature
                };
            });
            const { provider: chosenProvider } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'provider',
                    message: chalk.hex('#9c88ff')(`🔧 Select a ${selectedFeature} provider:`),
                    choices: providerChoices,
                    pageSize: 10
                }
            ]);
            selectedProvider = chosenProvider;
        }
        else if (!selectedProvider && subFeatures.length === 1) {
            selectedProvider = subFeatures[0];
        }
        // Add the selected feature
        console.log(chalk.hex('#9c88ff')(`\n🚀 Adding ${selectedFeature}${selectedProvider ? ` (${selectedProvider})` : ''} to your project...`));
        await addFeature(selectedFeature, selectedProvider, process.cwd());
        // Record feature addition in history
        try {
            const currentPath = process.cwd();
            const projectName = path.basename(currentPath);
            await historyManager.recordFeature({
                name: selectedFeature,
                projectName: projectName,
                provider: selectedProvider,
                projectPath: currentPath,
                framework: projectInfo.framework,
                success: true
            });
        }
        catch (error) {
            console.warn(chalk.yellow('⚠️  Could not save feature to history'));
        }
        console.log(chalk.green(`\n✅ Successfully added ${selectedFeature}${selectedProvider ? ` (${selectedProvider})` : ''} to your project!`));
        // Show next steps
        showNextSteps(selectedFeature, selectedProvider);
    }
    catch (error) {
        console.error(chalk.red(`❌ Error adding feature: ${error.message}`));
        // Record failed feature addition
        try {
            await historyManager.recordFeature({
                name: feature || 'unknown',
                projectName: path.basename(process.cwd()),
                provider: provider,
                projectPath: process.cwd(),
                framework: 'unknown',
                success: false
            });
        }
        catch (historyError) {
            // Ignore history errors
        }
        process.exit(1);
    }
}
/**
 * Get provider description based on feature and provider
 */
function getProviderDescription(feature, provider) {
    const descriptions = {
        auth: {
            'clerk': 'Modern authentication with built-in UI components',
            'auth0': 'Enterprise-grade authentication platform',
            'nextauth': 'Authentication for Next.js applications',
            'firebase': 'Google Firebase Authentication',
            'supabase': 'Open source Firebase alternative'
        },
        aws: {
            'ec2': 'Elastic Compute Cloud - Virtual servers',
            's3': 'Simple Storage Service - Object storage',
            'lambda': 'Serverless compute service',
            'rds': 'Relational Database Service',
            'cloudfront': 'Content Delivery Network',
            'cognito': 'User identity and authentication',
            'dynamodb': 'NoSQL database service',
            'sqs': 'Simple Queue Service',
            'sns': 'Simple Notification Service',
            'iam': 'Identity and Access Management'
        },
        ai: {
            'openai': 'GPT models and DALL-E integration',
            'claude': 'Anthropic Claude AI assistant',
            'gemini': 'Google Gemini AI models',
            'grok': 'xAI Grok language model',
            'open-router': 'Universal API for multiple AI models'
        },
        database: {
            'prisma': 'Next-generation ORM for Node.js',
            'mongoose': 'MongoDB object modeling',
            'drizzle': 'TypeScript ORM for SQL databases',
            'sequelize': 'Promise-based ORM for multiple databases',
            'typeorm': 'ORM for TypeScript and JavaScript'
        },
        storage: {
            's3': 'AWS S3 object storage integration',
            'cloudinary': 'Image and video management',
            'firebase': 'Google Firebase Storage',
            'supabase': 'Supabase Storage integration'
        },
        payment: {
            'stripe': 'Complete payments platform',
            'paypal': 'PayPal payment integration',
            'razorpay': 'Indian payment gateway',
            'square': 'Square payment processing'
        }
    };
    return descriptions[feature]?.[provider] || `${provider} integration`;
}
/**
 * Show next steps after feature addition
 */
function showNextSteps(feature, provider) {
    console.log(`\n${chalk.hex('#00d2d3')('📋 Next Steps:')}`);
    switch (feature) {
        case 'auth':
            console.log(chalk.hex('#95afc0')('1. Configure your authentication provider'));
            console.log(chalk.hex('#95afc0')('2. Update your .env file with API keys'));
            console.log(chalk.hex('#95afc0')('3. Test the authentication flow'));
            break;
        case 'aws':
            console.log(chalk.hex('#95afc0')('1. Configure AWS credentials'));
            console.log(chalk.hex('#95afc0')('2. Update .env file with AWS region and access keys'));
            console.log(chalk.hex('#95afc0')('3. Test the AWS service integration'));
            break;
        case 'ai':
            console.log(chalk.hex('#95afc0')('1. Get API key from your AI provider'));
            console.log(chalk.hex('#95afc0')('2. Add API key to .env file'));
            console.log(chalk.hex('#95afc0')('3. Test AI integration endpoints'));
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
            console.log(chalk.hex('#95afc0')(`1. Check the ${feature} configuration`));
            console.log(chalk.hex('#95afc0')('2. Update .env file with necessary variables'));
            console.log(chalk.hex('#95afc0')('3. Test the integration'));
    }
    console.log(chalk.hex('#95afc0')('\n💡 Check your project files for any additional setup instructions'));
}
/**
 * Add feature to project from create command integration
 */
export async function addFeatureToProject(projectPath, category, provider, framework) {
    try {
        console.log(chalk.cyan(`🔧 Adding ${provider} for ${category}...`));
        // Call the main add command with framework override
        await addCommand(category, provider, {
            framework,
            projectPath,
            list: false,
            verbose: false
        });
        return true;
    }
    catch (error) {
        console.log(chalk.red(`❌ Failed to add ${provider} for ${category}: ${error}`));
        return false;
    }
}
