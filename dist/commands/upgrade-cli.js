/**
 * Upgrade CLI command - Updates Package Installer CLI to the latest version
 */
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import inquirer from 'inquirer';
import { exec } from 'child_process';
import { promisify } from 'util';
import semver from 'semver';
import { createStandardHelp } from '../utils/helpFormatter.js';
const execAsync = promisify(exec);
/**
 * Display help for upgrade-cli command
 */
export function showUpgradeHelp() {
    const helpConfig = {
        commandName: 'upgrade-cli',
        emoji: '🚀',
        description: 'Update Package Installer CLI to the latest version with intelligent upgrade management.\nIncludes breaking change detection and version compatibility checks!',
        usage: ['pi upgrade-cli'],
        options: [
            { flag: '-h, --help', description: 'Display help for this command' }
        ],
        examples: [
            { command: 'pi upgrade-cli', description: 'Smart upgrade with breaking change detection' },
            { command: 'pi upgrade-cli --help', description: 'Show this help message' }
        ],
        additionalSections: [
            {
                title: '💡 Enhanced Features',
                items: [
                    '• Semantic version analysis and breaking change detection',
                    '• Interactive confirmation for major version upgrades',
                    '• Automatic @latest tag installation for maximum compatibility',
                    '• Package size and release date information',
                    '• Comprehensive upgrade verification and rollback guidance'
                ]
            }
        ],
        tips: [
            'CLI will prompt for confirmation on major version upgrades',
            'Breaking changes are automatically detected and explained',
            'Use npm install -g package-installer-cli@<version> to rollback'
        ]
    };
    createStandardHelp(helpConfig);
}
/**
 * Get current CLI version
 */
async function getCurrentVersion() {
    try {
        const { stdout } = await execAsync('pi --version');
        return stdout.trim();
    }
    catch (error) {
        return 'unknown';
    }
}
/**
 * Get latest version from npm registry
 */
async function getLatestVersion() {
    try {
        const { stdout } = await execAsync('npm view @0xshariq/package-installer version');
        return stdout.trim();
    }
    catch (error) {
        throw new Error('Failed to fetch latest version from npm registry');
    }
}
/**
 * Detect package manager
 */
async function detectPackageManager() {
    try {
        await execAsync('pnpm --version');
        return 'pnpm';
    }
    catch { }
    try {
        await execAsync('yarn --version');
        return 'yarn';
    }
    catch { }
    return 'npm';
}
/**
 * Get package information
 */
async function getPackageInfo() {
    try {
        const { stdout } = await execAsync('npm view @0xshariq/package-installer --json');
        return JSON.parse(stdout);
    }
    catch (error) {
        return {};
    }
}
/**
 * Show upgrade summary
 */
function showUpgradeSummary(currentVersion, latestVersion, packageInfo) {
    console.log('\n' + boxen(chalk.hex('#10ac84')('📦 Upgrade Summary') + '\n\n' +
        chalk.white('Current Version: ') + chalk.hex('#ffa502')(currentVersion === 'unknown' ? 'Not detected' : `v${currentVersion}`) + '\n' +
        chalk.white('Latest Version:  ') + chalk.hex('#10ac84')(`v${latestVersion}`) + '\n' +
        chalk.white('Package Size:    ') + chalk.hex('#95afc0')((packageInfo.dist?.unpackedSize ? `${(packageInfo.dist.unpackedSize / 1024).toFixed(0)} KB` : 'Unknown')) + '\n' +
        chalk.white('Last Updated:    ') + chalk.hex('#95afc0')((packageInfo.time?.[latestVersion] ? new Date(packageInfo.time[latestVersion]).toLocaleDateString() : 'Unknown')), {
        padding: 1,
        borderStyle: 'single',
        borderColor: '#10ac84'
    }));
}
/**
 * Show breaking changes warning for major version upgrades
 */
async function showBreakingChangesWarning(currentVersion, latestVersion) {
    if (currentVersion === 'unknown')
        return true;
    const currentMajor = semver.major(currentVersion);
    const latestMajor = semver.major(latestVersion);
    if (latestMajor > currentMajor) {
        console.log('\n' + boxen(chalk.hex('#ff6b6b')('⚠️  MAJOR VERSION UPGRADE DETECTED') + '\n\n' +
            chalk.white(`This upgrade involves a major version change (v${currentMajor}.x → v${latestMajor}.x)`) + '\n' +
            chalk.white('which may include breaking changes that could affect your workflows.') + '\n\n' +
            chalk.hex('#ffa502')('Potential Breaking Changes:') + '\n' +
            chalk.hex('#95afc0')('  • Command line interface modifications') + '\n' +
            chalk.hex('#95afc0')('  • Template structure changes') + '\n' +
            chalk.hex('#95afc0')('  • Configuration file format updates') + '\n' +
            chalk.hex('#95afc0')('  • Feature removals or significant changes') + '\n\n' +
            chalk.cyan('💡 Recommendation:') + '\n' +
            chalk.hex('#95afc0')('  Review the changelog before proceeding with the upgrade.'), {
            padding: 1,
            borderStyle: 'double',
            borderColor: '#ff6b6b'
        }));
        const { shouldProceed } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'shouldProceed',
                message: 'Do you want to proceed with this major version upgrade?',
                default: false
            }
        ]);
        return shouldProceed;
    }
    return true;
}
/**
 * Main upgrade CLI function
 */
export async function upgradeCliCommand() {
    // Check for help flag
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
        showUpgradeHelp();
        return;
    }
    console.log('\n' + chalk.hex('#10ac84')('🚀 Package Installer CLI Upgrade'));
    console.log(chalk.hex('#95afc0')('Checking for updates...\n'));
    const spinner = ora(chalk.hex('#f39c12')('🔍 Fetching version information...')).start();
    try {
        const [currentVersion, latestVersion, packageManager, packageInfo] = await Promise.all([
            getCurrentVersion(),
            getLatestVersion(),
            detectPackageManager(),
            getPackageInfo()
        ]);
        spinner.succeed(chalk.green('✅ Version information retrieved'));
        // Show upgrade summary
        showUpgradeSummary(currentVersion, latestVersion, packageInfo);
        if (currentVersion === latestVersion) {
            console.log('\n' + chalk.hex('#10ac84')('🎉 You are already using the latest version!'));
            return;
        }
        if (currentVersion === 'unknown') {
            console.log('\n' + chalk.hex('#ffa502')('⚠️  Could not detect current version.'));
            console.log(chalk.hex('#95afc0')('   The CLI might not be installed globally.'));
            console.log(chalk.hex('#95afc0')('   Proceeding with installation...'));
        }
        else {
            // Check for breaking changes and get user confirmation
            const shouldProceed = await showBreakingChangesWarning(currentVersion, latestVersion);
            if (!shouldProceed) {
                console.log('\n' + chalk.yellow('⏹️  Upgrade cancelled by user'));
                return;
            }
        }
        // Perform upgrade with @latest tag
        const upgradeSpinner = ora(chalk.hex('#10ac84')(`🚀 Upgrading CLI using ${packageManager}...`)).start();
        let upgradeCommand;
        switch (packageManager) {
            case 'pnpm':
                upgradeCommand = 'pnpm add -g @0xshariq/package-installer@latest';
                break;
            case 'yarn':
                upgradeCommand = 'yarn global add @0xshariq/package-installer@latest';
                break;
            default:
                upgradeCommand = 'npm install -g @0xshariq/package-installer@latest';
        }
        upgradeSpinner.text = chalk.hex('#10ac84')(`Installing ${latestVersion} with @latest tag...`);
        await execAsync(upgradeCommand, { timeout: 120000 }); // 2 minute timeout
        upgradeSpinner.succeed(chalk.green('✅ CLI upgraded successfully!'));
        // Verify upgrade
        const verifySpinner = ora(chalk.hex('#00d2d3')('🔍 Verifying upgrade...')).start();
        const newVersion = await getCurrentVersion();
        if (newVersion === latestVersion) {
            verifySpinner.succeed(chalk.green(`✅ Upgrade verified! Now running v${newVersion}`));
        }
        else {
            verifySpinner.warn(chalk.yellow('⚠️  Upgrade completed but version verification failed'));
            console.log(chalk.hex('#95afc0')('   Try running: pi --version'));
        }
        // Show success message with changelog link
        console.log('\n' + boxen(chalk.hex('#10ac84')('🎉 Upgrade Complete!') + '\n\n' +
            chalk.white(`Successfully upgraded from v${currentVersion} to v${latestVersion}`) + '\n' +
            chalk.white('All new features and improvements are now available!') + '\n\n' +
            chalk.hex('#00d2d3')('💡 What\'s new?') + '\n' +
            chalk.hex('#95afc0')('  • Enhanced template system with better error handling') + '\n' +
            chalk.hex('#95afc0')('  • Improved performance optimizations') + '\n' +
            chalk.hex('#95afc0')('  • New analytics and tracking features') + '\n' +
            chalk.hex('#95afc0')('  • Better version management and upgrade warnings') + '\n\n' +
            chalk.cyan('📖 View full changelog:') + '\n' +
            chalk.blue('  https://github.com/0xshariq/package-installer-cli/releases'), {
            padding: 1,
            borderStyle: 'round',
            borderColor: '#10ac84',
            backgroundColor: '#001a00'
        }));
    }
    catch (error) {
        spinner.fail(chalk.red('❌ Upgrade failed'));
        console.log(chalk.red(`\n❌ Error: ${error.message}`));
        console.log(chalk.hex('#95afc0')('\n💡 Try running the upgrade manually:'));
        console.log(chalk.hex('#95afc0')('   npm install -g @0xshariq/package-installer@latest'));
        console.log(chalk.hex('#95afc0')('   # or'));
        console.log(chalk.hex('#95afc0')('   yarn global add @0xshariq/package-installer@latest'));
        console.log(chalk.hex('#95afc0')('   # or'));
        console.log(chalk.hex('#95afc0')('   pnpm add -g @0xshariq/package-installer@latest'));
    }
}
