/**
 * Banner utility for Package Installer CLI v3.2.0
 * Provides consistent banner display across all commands
 */
import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';
/**
 * Generate the main CLI banner with gradient colors
 */
export function generateBanner() {
    const packageGradient = gradient(['#00c6ff', '#4facfe', '#6c5ce7']);
    const installerGradient = gradient(['#fd79a8', '#e84393', '#fd79a8']);
    return boxen(packageGradient('           ██████╗  █████╗  ██████╗██╗  ██╗ █████╗  ██████╗ ███████╗') + '\n' +
        packageGradient('           ██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔══██╗██╔════╝ ██╔════╝') + '\n' +
        packageGradient('           ██████╔╝███████║██║     █████╔╝ ███████║██║  ███╗█████╗  ') + '\n' +
        packageGradient('           ██╔═══╝ ██╔══██║██║     ██╔═██╗ ██╔══██║██║   ██║██╔══╝  ') + '\n' +
        packageGradient('           ██║     ██║  ██║╚██████╗██║  ██╗██║  ██║╚██████╔╝███████╗') + '\n' +
        packageGradient('           ╚═╝     ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝') + '\n' +
        '                                                                                   \n' +
        installerGradient('    ██╗███╗   ██╗███████╗████████╗ █████╗ ██╗     ██╗     ███████╗██████╗') + '\n' +
        installerGradient('    ██║████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██║     ██║     ██╔════╝██╔══██╗') + '\n' +
        installerGradient('    ██║██╔██╗ ██║███████╗   ██║   ███████║██║     ██║     █████╗  ██████╔╝') + '\n' +
        installerGradient('    ██║██║╚██╗██║╚════██║   ██║   ██╔══██║██║     ██║     ██╔══╝  ██╔══██╗') + '\n' +
        installerGradient('    ██║██║ ╚████║███████║   ██║   ██║  ██║███████╗███████╗███████╗██║  ██║') + '\n' +
        installerGradient('    ╚═╝╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝') + '\n' +
        '                                                                                   \n' +
        '                                                                                   \n' +
        chalk.hex('#00d2d3')('                🚀 The Ultimate Modern Project Scaffolding Tool                ') + '\n' +
        chalk.hex('#95afc0')('               ✨ Fast • Smart • Feature-Rich • Production-Ready               ') + '\n' +
        chalk.hex('#ffa502')('    💡 Create stunning web applications with integrated features in seconds    ') + '\n' +
        '                                                                                   ', {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        backgroundColor: '#0a0a0a'
    });
}
/**
 * Generate version info banner
 */
export function generateVersionBanner() {
    return boxen(chalk.hex('#00d2d3')('📦 Version: ') + chalk.hex('#ffa502')('v3.2.0') +
        chalk.hex('#95afc0')('  •  ') + chalk.hex('#00d2d3')('🎯 Frameworks: ') + chalk.hex('#ffa502')('12+') +
        chalk.hex('#95afc0')('  •  ') + chalk.hex('#00d2d3')('📋 Templates: ') + chalk.hex('#ffa502')('50+') +
        chalk.hex('#95afc0')('  •  ') + chalk.hex('#00d2d3')('⚡ Status: ') + chalk.hex('#10ac84')('Ready to scaffold!'), {
        padding: { top: 0, bottom: 0, left: 2, right: 2 },
        borderStyle: 'round',
        borderColor: 'cyan',
        backgroundColor: '#0a0a0a'
    });
}
/**
 * Display the complete banner (main + version)
 */
export function displayBanner() {
    console.log('\n' + generateBanner());
    console.log('\n' + generateVersionBanner());
}
/**
 * Display a simplified command banner
 */
export function displayCommandBanner(commandName, description) {
    const commandGradient = gradient(['#4facfe', '#00f2fe']);
    console.log('\n' + boxen(commandGradient(`🚀 ${commandName.toUpperCase()} COMMAND`) + '\n\n' +
        chalk.white(description) + '\n\n' +
        chalk.hex('#00d2d3')('💡 Package Installer CLI v3.2.0') + ' • ' +
        chalk.hex('#95afc0')('Fast • Smart • Feature-Rich'), {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        backgroundColor: '#0a0a0a'
    }));
}
