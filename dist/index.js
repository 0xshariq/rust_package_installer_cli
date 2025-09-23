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
import { deployCommand } from './commands/deploy.js';
import { cleanCommand, showCleanHelp } from './commands/clean.js';
import { environmentCommand, showEnvironmentHelp } from './commands/env.js';
import { doctorCommand, showDoctorHelp } from './commands/doctor.js';
// Import utilities
import { showBanner } from './utils/ui.js';
import { initializeCache } from './utils/cacheManager.js';
// Get current file directory for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load package.json to get version
let packageJsonPath = join(__dirname, '../package.json');
// Check if we're running from dist folder
if (__dirname.includes('/dist/')) {
    packageJsonPath = join(__dirname, '../../package.json');
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
        showBanner();
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
    .on('--help', () => {
    showCheckHelp();
})
    .action(async (packageName) => {
    try {
        await checkCommand(packageName);
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
    .on('--help', () => {
    showCloneHelp();
})
    .action(async (userRepo, projectName) => {
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
        await cloneRepo(userRepo, projectName);
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
    .on('--help', () => {
    showAddHelp();
})
    .action(async (feature, provider, options) => {
    try {
        await addCommand(feature, provider, options);
    }
    catch (error) {
        handleCommandError('add feature', error);
    }
});
// UPGRADE-CLI COMMAND - Update CLI to latest version
program
    .command('upgrade-cli')
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
    .description(chalk.hex('#667eea')('📊 ') + chalk.hex('#4facfe')('Show CLI usage analytics and framework statistics'))
    .on('--help', () => {
    showAnalyzeHelp();
})
    .action(async () => {
    try {
        await analyzeCommand();
    }
    catch (error) {
        handleCommandError('show analytics', error);
    }
});
// UPDATE COMMAND - Update project dependencies
program
    .command('update')
    .alias('u')
    .description(chalk.hex('#ff6b6b')('🔄 ') + chalk.hex('#fd79a8')('Update CLI, dependencies, and cache'))
    .option('-h, --help', 'Show help for update command')
    .on('--help', () => {
    showUpdateHelp();
})
    .action(async (options) => {
    try {
        await updateCommand(options);
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
    .option('--logs', 'Clean log files')
    .option('--all', 'Clean everything (safe)')
    .option('--deep', 'Deep clean (includes lock files)')
    .option('--dry-run', 'Preview what would be cleaned')
    .on("--help", () => {
    showCleanHelp();
})
    .action(async (options) => {
    try {
        showBanner();
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
    .action(async (subcommand, type) => {
    try {
        const { cacheCommand } = await import('./commands/cache.js');
        await cacheCommand(subcommand, type);
    }
    catch (error) {
        handleCommandError('cache', error);
    }
});
// DEPLOY COMMAND - Future deployment features
program
    .command('deploy')
    .description(chalk.hex('#ff9a9e')('🚀 ') + chalk.hex('#fd79a8')('Deploy your project (Coming Soon)'))
    .on('--help', () => {
    // Help is handled in the command file
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
    showBanner();
    console.log('\n' + boxen(chalk.white('Welcome to Package Installer CLI! 👋') + '\n\n' +
        chalk.hex('#00d2d3')('🚀 Ready to build something amazing?') + '\n\n' +
        chalk.hex('#95afc0')('Start with these popular commands:') + '\n\n' +
        chalk.hex('#10ac84')('  ') + piGradient('pi') + ' ' + gradient(['#10ac84', '#00d2d3'])('create') + chalk.hex('#95afc0')('           # Create new project (React, Next.js, Vue, etc.)') + '\n' +
        chalk.hex('#9c88ff')('  ') + piGradient('pi') + ' ' + gradient(['#9c88ff', '#667eea'])('analyze') + chalk.hex('#95afc0')('          # Show project analytics dashboard') + '\n' +
        chalk.hex('#ff6b6b')('  ') + piGradient('pi') + ' ' + gradient(['#ff6b6b', '#ff9a9e'])('update') + chalk.hex('#95afc0')('           # Update packages to latest versions') + '\n' +
        chalk.hex('#00d2d3')('  ') + piGradient('pi') + ' ' + gradient(['#00d2d3', '#0084ff'])('clone') + chalk.hex('#95afc0')(' user/repo   # Clone and setup GitHub repositories') + '\n\n' +
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
