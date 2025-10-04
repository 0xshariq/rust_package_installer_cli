#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
// Import command handlers
import { createProject, showCreateHelp } from './commands/create.js';
import { checkCommand, showCheckHelp } from './commands/check.js';
import { cloneRepo, showCloneHelp } from './commands/clone.js';
import { addCommand, showAddHelp } from './commands/add.js';
import { showUpgradeHelp, upgradeCliCommand } from './commands/upgrade-cli.js';
import { updateCommand, showUpdateHelp } from './commands/update.js';
import { analyzeCommand, showAnalyzeHelp } from './commands/analyze.js';
import { deployCommand, showDeployHelp } from './commands/deploy.js';
import { cleanCommand, showCleanHelp } from './commands/clean.js';
import { cacheCommand, showCacheHelp } from './commands/cache.js';
import { environmentCommand, showEnvironmentHelp } from './commands/env.js';
import { doctorCommand, showDoctorHelp } from './commands/doctor.js';
import { emailCommand, showEmailHelp } from './commands/email.js';
// Import utilities
import { initializeCache } from './utils/cacheManager.js';
import { displayBanner, displayCommandBanner } from './utils/banner.js';
import { getPackageJsonPath } from './utils/pathResolver.js';
// Get current file directory for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load package.json to get version using improved path resolution
let packageJsonPath;
try {
    packageJsonPath = getPackageJsonPath();
}
catch (error) {
    // Fallback to the old method if getPackageJsonPath fails
    packageJsonPath = join(__dirname, '../package.json');
    // Check if we're running from dist folder
    if (__dirname.includes('/dist/')) {
        packageJsonPath = join(__dirname, '../../package.json');
    }
}
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const VERSION = packageJson.version;
// Initialize CLI program
const program = new Command();
// Create beautiful blue gradient for CLI name
const gradientTitle = gradient(['#0072ff', '#00c6ff', '#0072ff']);
const piGradient = gradient(['#00c6ff', '#0072ff']);
// Configure main program with enhanced styling
program
    .name('pi')
    .description(chalk.hex('#667eea')('📦 Package Installer CLI') + chalk.hex('#95afc0')(' - Modern web application scaffolding tool'))
    .version(VERSION)
    .configureHelp({
    sortSubcommands: true,
    subcommandTerm: (cmd) => cmd.name(),
});
/**
 * Enhanced error handler with better formatting
 */
function handleCommandError(commandName, error) {
    console.log('\n' + boxen(chalk.red('❌ Command Failed') + '\n\n' +
        chalk.white(`Command: ${commandName}`) + '\n' +
        chalk.white(`Error: ${error.message}`) + '\n\n' +
        chalk.gray('💡 Try running with --help for usage information'), {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'red',
        backgroundColor: '#1a0000'
    }));
    process.exit(1);
}
// CREATE COMMAND - Main project creation from templates
program
    .command('create')
    .description(chalk.hex('#10ac84')('🚀 Create a new project from templates'))
    .argument('[project-name]', chalk.hex('#95afc0')('Project name (will prompt if not provided)'))
    .configureHelp({
    helpWidth: 120,
})
    .on('--help', () => {
    showCreateHelp();
})
    .action(async (projectName) => {
    try {
        displayCommandBanner('create', 'Create a new project from templates');
        await createProject(projectName);
    }
    catch (error) {
        handleCommandError('create project', error);
    }
});
// CHECK COMMAND - Package version checking and suggestions
program
    .command('check')
    .description(chalk.hex('#f39c12')('🔍 ') + chalk.hex('#ffa500')('Check package versions and get update suggestions'))
    .argument('[package-name]', chalk.hex('#95afc0')('Specific package to check (optional)'))
    .option('-v, --verbose', 'Show detailed information for all packages')
    .option('-h, --help', 'Display help for this command')
    .on('--help', () => {
    showCheckHelp();
})
    .action(async (packageName, options) => {
    try {
        if (options.help) {
            showCheckHelp();
            return;
        }
        await checkCommand(packageName, options);
    }
    catch (error) {
        handleCommandError('check packages', error);
    }
});
// CLONE COMMAND - GitHub repository cloning
program
    .command('clone')
    .description(chalk.hex('#00d2d3')('📥 ') + chalk.hex('#00cec9')('Clone repositories from GitHub, GitLab, BitBucket & SourceHut'))
    .argument('[user/repo]', chalk.hex('#95afc0')('Repository in format "user/repo" or "provider:user/repo"'))
    .argument('[project-name]', chalk.hex('#95afc0')('Custom project name (defaults to repo name)'))
    .option('-h, --help', 'Display help for this command')
    .option('--offline', 'Use cached templates if available')
    .option('--no-deps', 'Skip dependency installation')
    .option('--no-git', 'Skip git initialization')
    .option('--shallow', 'Create shallow clone (faster)')
    .option('--branch <name>', 'Clone specific branch')
    .option('--template', 'Treat as template repository')
    .on('--help', () => {
    showCloneHelp();
})
    .action(async (userRepo, projectName, options) => {
    if (options.help) {
        showCloneHelp();
        return;
    }
    if (!userRepo) {
        console.log('\n' + chalk.hex('#ff4757')('❌ Error: Repository is required'));
        console.log(chalk.hex('#95afc0')('   Format: user/repo or provider:user/repo'));
        console.log(chalk.hex('#95afc0')('   Examples:'));
        console.log(chalk.hex('#95afc0')('     • ') + piGradient('pi') + ' ' + chalk.hex('#00d2d3')('clone') + ' facebook/react');
        console.log(chalk.hex('#95afc0')('     • ') + piGradient('pi') + ' ' + chalk.hex('#00d2d3')('clone') + ' gitlab:user/project');
        console.log(chalk.hex('#95afc0')('     • ') + piGradient('pi') + ' ' + chalk.hex('#00d2d3')('clone') + ' bitbucket:user/repo');
        return;
    }
    try {
        await cloneRepo(userRepo, projectName, options);
    }
    catch (error) {
        handleCommandError('clone repository', error);
    }
});
// ADD COMMAND - Add features to existing projects
program
    .command('add')
    .description(chalk.hex('#9c88ff')('➕ ') + chalk.hex('#4facfe')('Add new features to your project'))
    .argument('[feature]', chalk.hex('#95afc0')('Feature to add (auth, docker, aws, etc.) or use --list to show all'))
    .argument('[provider]', chalk.hex('#95afc0')('Provider for the feature (optional)'))
    .option('-l, --list', chalk.hex('#95afc0')('List all available features'))
    .option('-v, --verbose', chalk.hex('#95afc0')('Show detailed output'))
    .option('-h, --help', chalk.hex('#95afc0')('Display help for this command'))
    .on('--help', () => {
    showAddHelp();
})
    .action(async (feature, provider, options) => {
    try {
        if (options.help) {
            showAddHelp();
            return;
        }
        await addCommand(feature, provider, options);
    }
    catch (error) {
        handleCommandError('add feature', error);
    }
});
// UPGRADE-CLI COMMAND - Update CLI to latest version
program
    .command('upgrade-cli')
    .alias('upgrade')
    .description(chalk.hex('#ff6b6b')('🚀 ') + chalk.hex('#fd79a8')('Update Package Installer CLI to the latest version'))
    .on('--help', () => {
    showUpgradeHelp();
})
    .action(async () => {
    try {
        await upgradeCliCommand();
    }
    catch (error) {
        handleCommandError('upgrade CLI', error);
    }
});
// ANALYZE COMMAND - Terminal dashboard with analytics
program
    .command('analyze')
    .alias('stats')
    .description(chalk.hex('#667eea')('📊 ') + chalk.hex('#4facfe')('Show CLI usage analytics and framework statistics'))
    .option('--export', 'Export analytics data to JSON file')
    .option('--reset', 'Reset analytics history')
    .option('--detailed', 'Show detailed analytics breakdown')
    .option('-h, --help', 'Show this help message')
    .on('--help', () => {
    showAnalyzeHelp();
})
    .action(async (options) => {
    try {
        await analyzeCommand(options);
    }
    catch (error) {
        handleCommandError('show analytics', error);
    }
});
// UPDATE COMMAND - Update project dependencies
program
    .command('update')
    .alias('u')
    .description(chalk.hex('#ff6b6b')('🔄 ') + chalk.hex('#fd79a8')('Update project dependencies with breaking change detection'))
    .argument('[packages]', chalk.hex('#95afc0')('Comma-separated list of packages to update (optional)'))
    .option('--latest', 'Update to latest versions (may include breaking changes)')
    .option('-h, --help', 'Show help for update command')
    .on('--help', () => {
    showUpdateHelp();
})
    .action(async (packages, options) => {
    try {
        await updateCommand(packages, options);
    }
    catch (error) {
        handleCommandError('update', error);
    }
});
// CLEAN COMMAND - Clean development artifacts
program
    .command('clean')
    .alias('cleanup')
    .description(chalk.hex('#ffa502')('🧹 Clean development artifacts and caches'))
    .option('--node-modules', 'Clean node_modules directories')
    .option('--build', 'Clean build/dist directories')
    .option('--cache', 'Clean package manager caches')
    .option('--logs', 'Clean log files and debug outputs')
    .option('--all', 'Clean everything (safe operation)')
    .option('--deep', 'Deep clean (includes lock files)')
    .option('--dry-run', 'Preview what would be cleaned')
    .option('-h, --help', 'Show help for clean command')
    .on("--help", () => {
    showCleanHelp();
})
    .action(async (options) => {
    try {
        if (options.help) {
            showCleanHelp();
            return;
        }
        displayCommandBanner('clean', 'Clean development artifacts and caches');
        await cleanCommand(options);
    }
    catch (error) {
        handleCommandError('clean', error);
    }
});
// ENVIRONMENT COMMAND - Environment analysis
program
    .command('env')
    .alias('environment')
    .description(chalk.hex('#10ac84')('🌍 ') + chalk.hex('#00b894')('Analyze and manage development environment'))
    .option('--check', 'Check development tools and versions')
    .option('--generate', 'Generate .env template for project')
    .option('--validate', 'Validate existing .env file')
    .option('--export', 'Export environment info to file')
    .option('--system', 'Show system information only')
    .option('-h, --help', 'Show help for environment command')
    .on('--help', () => {
    showEnvironmentHelp();
})
    .action(async (options) => {
    try {
        await environmentCommand(options);
    }
    catch (error) {
        handleCommandError('environment', error);
    }
});
// DOCTOR COMMAND - Diagnose and fix issues
program
    .command('doctor')
    .alias('diagnose')
    .description(chalk.hex('#ff6b6b')('🩺 ') + chalk.hex('#e17055')('Diagnose and fix development issues'))
    .option('--fix', 'Automatically fix detected issues')
    .option('--node', 'Check Node.js and npm setup only')
    .option('--deps', 'Check project dependencies only')
    .option('--tools', 'Check development tools only')
    .option('--verbose', 'Show detailed diagnostic information')
    .option('-h, --help', 'Show help for doctor command')
    .on('--help', () => {
    showDoctorHelp();
})
    .action(async (options) => {
    try {
        await doctorCommand(options);
    }
    catch (error) {
        handleCommandError('doctor', error);
    }
});
// CACHE COMMAND - Manage CLI cache system
program
    .command('cache')
    .description(chalk.hex('#00d2d3')('🗄️ ') + chalk.hex('#0084ff')('Manage CLI cache system'))
    .argument('[subcommand]', 'Cache subcommand (stats, clear, info, optimize)')
    .argument('[type]', 'Type for clear command (projects, analysis, packages, templates, system, all)')
    .option('--stats', 'Show cache statistics')
    .option('--clear [type]', 'Clear cache (optionally specify type)')
    .option('--info', 'Show cache configuration')
    .option('--optimize', 'Optimize cache performance')
    .option('--size', 'Show cache size information')
    .option('-h, --help', 'Show help for cache command')
    .on('--help', async () => {
    showCacheHelp();
})
    .action(async (subcommand, type, options) => {
    try {
        await cacheCommand(subcommand, type, options);
    }
    catch (error) {
        handleCommandError('cache', error);
    }
});
// EMAIL COMMAND - Contact developer with feedback
program
    .command('email')
    .description(chalk.hex('#00d2d3')('📧 ') + chalk.hex('#4facfe')('Contact developer with feedback, bug reports, and feature requests'))
    .argument('[category]', chalk.hex('#95afc0')('Feedback category (bug, feature, template, question, improvement, docs)'))
    .option('-h, --help', chalk.hex('#95afc0')('Display help for this command'))
    .option('-l, --list', chalk.hex('#95afc0')('List all available email categories'))
    .option('--install', chalk.hex('#95afc0')('Show Email MCP Server installation instructions'))
    .option('--setup', chalk.hex('#95afc0')('Show email configuration setup guide'))
    .option('--status', chalk.hex('#95afc0')('Check email system status and availability'))
    .option('--test', chalk.hex('#95afc0')('Send a test email to verify functionality'))
    .option('--commands', chalk.hex('#95afc0')('Show all available Email MCP Server commands'))
    .option('--dev', chalk.hex('#95afc0')('Show development setup information and troubleshooting'))
    .option('--quick', chalk.hex('#95afc0')('Quick feedback mode with minimal prompts'))
    .on('--help', () => {
    showEmailHelp();
})
    .action(async (category, options) => {
    try {
        await emailCommand(category, options);
    }
    catch (error) {
        handleCommandError('email', error);
    }
});
// DEPLOY COMMAND - Future deployment features
program
    .command('deploy')
    .description(chalk.hex('#ff9a9e')('🚀 ') + chalk.hex('#fd79a8')('Deploy your project (Coming Soon)'))
    .on('--help', () => {
    showDeployHelp();
})
    .action(async () => {
    try {
        await deployCommand();
    }
    catch (error) {
        handleCommandError('deploy project', error);
    }
});
// ENHANCED GLOBAL HELP - Beautiful examples and usage information
program.on('--help', () => {
    const exampleGradient = gradient(['#43e97b', '#38f9d7']);
    const commandGradient = gradient(['#667eea', '#764ba2']);
    const createGradient = gradient(['#10ac84', '#00d2d3']);
    const analyzeGradient = gradient(['#9c88ff', '#667eea']);
    const updateGradient = gradient(['#ff6b6b', '#ff9a9e']);
    const addGradient = gradient(['#ffa502', '#ff7675']);
    console.log('\n' + boxen(exampleGradient('🚀 Complete Command Reference & Examples') + '\n\n' +
        chalk.hex('#00d2d3')('📋 CORE COMMANDS (Available Now)') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + createGradient('create') + chalk.hex('#95afc0')('                  # Interactive project creation') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + createGradient('create') + chalk.hex('#95afc0')(' my-nextjs-app    # Create with specific name') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + analyzeGradient('analyze') + chalk.hex('#95afc0')('                 # Show project analytics dashboard') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + updateGradient('update') + chalk.hex('#95afc0')('                  # Update packages interactively') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + updateGradient('update') + chalk.hex('#95afc0')(' lodash react     # Update specific packages') + '\n\n' +
        chalk.hex('#ffa502')('🔧 UTILITY COMMANDS') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + addGradient('add') + chalk.hex('#95afc0')('                     # Add features to existing project') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + addGradient('add') + chalk.hex('#95afc0')(' auth               # Add authentication features') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + addGradient('add') + chalk.hex('#95afc0')(' docker             # Add Docker configuration') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('check') + chalk.hex('#95afc0')('                   # Check package versions') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('check') + chalk.hex('#95afc0')(' react             # Check specific package') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('email') + chalk.hex('#95afc0')('                   # Contact developer with feedback') + '\n' +
        chalk.hex('#ff6b6b')('🌍 REPOSITORY & DEPLOYMENT') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('clone') + chalk.hex('#95afc0')('                   # Clone repositories interactively') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('clone') + chalk.hex('#95afc0')(' facebook/react    # Clone popular repositories') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('clone') + chalk.hex('#95afc0')(' user/repo my-app  # Clone with custom name') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('deploy') + chalk.hex('#95afc0')('                  # Deploy to cloud platforms') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('deploy') + chalk.hex('#95afc0')(' --vercel          # Deploy to Vercel') + '\n\n' +
        chalk.hex('#9c88ff')('🩺 DEVELOPMENT & DEBUGGING') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('doctor') + chalk.hex('#95afc0')('                  # Diagnose project issues') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('doctor') + chalk.hex('#95afc0')(' --fix             # Auto-fix common issues') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('env') + chalk.hex('#95afc0')('                     # Check development environment') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('env') + chalk.hex('#95afc0')(' --setup           # Setup optimal dev environment') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('clean') + chalk.hex('#95afc0')('                   # Clean artifacts and caches') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('cache') + chalk.hex('#95afc0')('                   # Manage CLI cache system') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + commandGradient('upgrade-cli') + chalk.hex('#95afc0')('            # Upgrade CLI to latest version') + '\n\n' +
        chalk.hex('#00d2d3')('💡 Pro Tips & Best Practices:') + '\n' +
        chalk.hex('#95afc0')('  • Use ') + chalk.hex('#ff6b6b')('--help') + chalk.hex('#95afc0')(' with any command for detailed options') + '\n' +
        chalk.hex('#95afc0')('  • Most commands are interactive - just run ') + piGradient('pi command') + '\n' +
        chalk.hex('#95afc0')('  • Support for React, Next.js, Vue, Angular, Express, Rust & more!') + '\n' +
        chalk.hex('#95afc0')('  • Templates include TypeScript, Tailwind CSS, shadcn/ui options') + '\n' +
        chalk.hex('#95afc0')('  • Multi-language package updates (Node.js, Rust, Python, Go)'), {
        padding: 1,
        borderStyle: 'round',
        borderColor: '#10ac84',
        backgroundColor: '#001a00'
    }));
});
// ENHANCED DEFAULT BEHAVIOR - Beautiful banner and help when no command provided
if (process.argv.length === 2) {
    displayBanner();
    console.log('\n' + boxen(chalk.white('Welcome to Package Installer CLI! 👋') + '\n\n' +
        chalk.hex('#00d2d3')('🚀 Ready to build something amazing?') + '\n\n' +
        chalk.hex('#95afc0')('Start with these popular commands:') + '\n\n' +
        chalk.hex('#10ac84')('  ') + piGradient('pi') + ' ' + gradient(['#10ac84', '#00d2d3'])('create') + chalk.hex('#95afc0')('           # Create new project (React, Next.js, Vue, etc.)') + '\n' +
        chalk.hex('#9c88ff')('  ') + piGradient('pi') + ' ' + gradient(['#9c88ff', '#667eea'])('analyze') + chalk.hex('#95afc0')('          # Show project analytics dashboard') + '\n' +
        chalk.hex('#ff6b6b')('  ') + piGradient('pi') + ' ' + gradient(['#ff6b6b', '#ff9a9e'])('update') + chalk.hex('#95afc0')('           # Update packages to latest versions') + '\n' +
        chalk.hex('#00d2d3')('  ') + piGradient('pi') + ' ' + gradient(['#00d2d3', '#0084ff'])('clone') + chalk.hex('#95afc0')(' user/repo   # Clone and setup GitHub repositories') + '\n' +
        chalk.hex('#00d2d3')('  ') + piGradient('pi') + ' ' + gradient(['#00d2d3', '#4facfe'])('email') + chalk.hex('#95afc0')('            # Contact developer with feedback') + '\n\n' +
        chalk.hex('#ffa502')('Need help? Try these:') + '\n\n' +
        chalk.hex('#ff6b6b')('  ') + piGradient('pi') + ' ' + chalk.hex('#ff6b6b')('--help') + chalk.hex('#95afc0')('           # See all available commands') + '\n' +
        chalk.hex('#95afc0')('  ') + piGradient('pi') + ' ' + chalk.hex('#95afc0')('command --help') + chalk.hex('#95afc0')('   # Get detailed help for any command') + '\n\n' +
        chalk.hex('#00d2d3')('💡 Pro tip: All commands are interactive - just run them and follow prompts!'), {
        padding: 1,
        borderStyle: 'round',
        borderColor: '#00c6ff',
        backgroundColor: '#000a1a'
    }));
}
// Initialize cache system on startup
(async () => {
    try {
        await initializeCache();
    }
    catch (error) {
        // Silent fail - cache will work in memory
    }
})();
// Parse command line arguments
program.parse();
