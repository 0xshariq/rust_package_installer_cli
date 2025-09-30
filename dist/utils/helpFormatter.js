/**
 * Standardized Help Formatter for Package Installer CLI
 * Creates consistent, beautiful help displays for all commands
 */
import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { getPackageVersion } from './utils.js';
/**
 * Create standardized help display for commands
 */
export function createStandardHelp(config) {
    const version = getPackageVersion();
    const piGradient = gradient(['#00c6ff', '#0072ff']);
    const headerGradient = gradient(['#4facfe', '#00f2fe']);
    let helpContent = '';
    // Header
    helpContent += headerGradient(`${config.emoji} Package Installer CLI - ${config.commandName} Command`) + '\n\n';
    // Description
    helpContent += chalk.white(config.description) + '\n\n';
    // Usage
    helpContent += chalk.cyan('Usage:') + '\n';
    config.usage.forEach(usage => {
        helpContent += chalk.white(`  ${piGradient('pi')} ${usage}`) + '\n';
    });
    helpContent += '\n';
    // Options
    helpContent += chalk.cyan('Options:') + '\n';
    // Check if help flag already exists
    const hasHelpFlag = config.options && config.options.some(option => option.flag.includes('-h') || option.flag.includes('--help'));
    // Add custom options first
    if (config.options && config.options.length > 0) {
        config.options.forEach(option => {
            helpContent += chalk.gray(`  ${option.flag.padEnd(20)} ${option.description}`) + '\n';
        });
    }
    // Add the global help flag only if it doesn't already exist
    if (!hasHelpFlag) {
        helpContent += chalk.gray(`  -h, --help`.padEnd(20) + ' Show this help message') + '\n';
    }
    helpContent += '\n';
    // Examples
    if (config.examples && config.examples.length > 0) {
        helpContent += chalk.cyan('Examples:') + '\n';
        config.examples.forEach(example => {
            // Check if command already starts with 'pi', if not add it
            const command = example.command.startsWith('pi ') ? example.command : `pi ${example.command}`;
            const formattedCommand = command.replace(/^pi /, `${piGradient('pi')} `);
            helpContent += chalk.gray(`  ${formattedCommand.padEnd(35)} # ${example.description}`) + '\n';
        });
        helpContent += '\n';
    }
    // Additional sections
    if (config.additionalSections && config.additionalSections.length > 0) {
        config.additionalSections.forEach(section => {
            helpContent += chalk.hex('#00d2d3')(`💡 ${section.title}:`) + '\n';
            section.items.forEach(item => {
                helpContent += chalk.hex('#95afc0')(`  • ${item}`) + '\n';
            });
            helpContent += '\n';
        });
    }
    // Tips
    if (config.tips && config.tips.length > 0) {
        config.tips.forEach(tip => {
            helpContent += chalk.yellow(`💡 Tip: ${tip}`) + '\n';
        });
    }
    // Version footer
    helpContent += chalk.hex('#636e72')(`\n📦 Package Installer CLI v${version} • Fast • Smart • Feature-Rich`);
    console.log('\n' + boxen(helpContent, {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        backgroundColor: '#0a0a0a'
    }));
}
/**
 * Quick help display for commands with minimal options
 */
export function createQuickHelp(commandName, emoji, description, usage, options) {
    const piGradient = gradient(['#00c6ff', '#0072ff']);
    const headerGradient = gradient(['#4facfe', '#00f2fe']);
    let helpContent = headerGradient(`${emoji} ${commandName.toUpperCase()} COMMAND HELP`) + '\n\n';
    helpContent += chalk.white(description) + '\n\n';
    helpContent += chalk.cyan('Usage:') + '\n';
    helpContent += chalk.white(`  ${piGradient('pi')} ${usage}`) + '\n\n';
    if (options.length > 0) {
        helpContent += chalk.cyan('Options:') + '\n';
        options.forEach(option => {
            helpContent += chalk.gray(`  ${option}`) + '\n';
        });
    }
    console.log('\n' + boxen(helpContent, {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        backgroundColor: '#0a0a0a'
    }));
}
/**
 * Create error help display
 */
export function createErrorHelp(commandName, error, suggestion) {
    let helpContent = chalk.red(`❌ ${commandName.toUpperCase()} ERROR`) + '\n\n';
    helpContent += chalk.white(error) + '\n';
    if (suggestion) {
        helpContent += '\n' + chalk.yellow(`💡 Suggestion: ${suggestion}`) + '\n';
    }
    helpContent += '\n' + chalk.gray(`Run: `) + chalk.cyan(`pi ${commandName} --help`) + chalk.gray(` for more information`);
    console.log('\n' + boxen(helpContent, {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'red',
        backgroundColor: '#0a0a0a'
    }));
}
