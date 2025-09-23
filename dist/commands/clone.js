import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';
import path from 'path';
import { cloneRepo as cloneRepoUtil } from '../utils/cloneUtils.js';
import { CacheManager } from '../utils/cacheUtils.js';
/**
 * Display help for clone command
 */
export function showCloneHelp() {
    const piGradient = gradient(['#00c6ff', '#0072ff']);
    const headerGradient = gradient(['#4facfe', '#00f2fe']);
    console.log('\n' + boxen(headerGradient('📥 Clone Command Help') + '\n\n' +
        chalk.white('Clone any public repository from GitHub, GitLab, BitBucket, or SourceHut.') + '\n' +
        chalk.white('Automatically installs dependencies, creates .env files, and tracks usage.') + '\n\n' +
        chalk.cyan('Usage:') + '\n' +
        chalk.white(`  ${piGradient('pi')} ${chalk.hex('#00d2d3')('clone')} <user/repo> [project-name]`) + '\n\n' +
        chalk.cyan('Options:') + '\n' +
        chalk.gray('  -h, --help       Display help for this command') + '\n' +
        chalk.gray('  --offline        Use cached templates if available') + '\n' +
        chalk.gray('  --no-deps        Skip dependency installation') + '\n' +
        chalk.gray('  --no-git         Skip git initialization') + '\n\n' +
        chalk.cyan('Examples:') + '\n' +
        chalk.gray(`  ${piGradient('pi')} ${chalk.hex('#00d2d3')('clone')} facebook/react my-react-copy      # Clone from GitHub with custom name`) + '\n' +
        chalk.gray(`  ${piGradient('pi')} ${chalk.hex('#00d2d3')('clone')} gitlab:user/project               # Clone from GitLab`) + '\n' +
        chalk.gray(`  ${piGradient('pi')} ${chalk.hex('#00d2d3')('clone')} bitbucket:user/repo               # Clone from BitBucket`) + '\n' +
        chalk.gray(`  ${piGradient('pi')} ${chalk.hex('#00d2d3')('clone')} sourcehut:user/repo               # Clone from SourceHut`) + '\n' +
        chalk.gray(`  ${piGradient('pi')} ${chalk.hex('#00d2d3')('clone')} user/repo ${chalk.hex('#ff6b6b')('--offline')}              # Use cached version if available`) + '\n' +
        chalk.gray(`  ${piGradient('pi')} ${chalk.hex('#00d2d3')('clone')} ${chalk.hex('#ff6b6b')('--help')}                            # Show this help message`) + '\n\n' +
        chalk.hex('#00d2d3')('💡 Supported Platforms:') + '\n' +
        chalk.hex('#95afc0')('  • GitHub (default): user/repo') + '\n' +
        chalk.hex('#95afc0')('  • GitLab: gitlab:user/repo') + '\n' +
        chalk.hex('#95afc0')('  • BitBucket: bitbucket:user/repo') + '\n' +
        chalk.hex('#95afc0')('  • SourceHut: sourcehut:user/repo') + '\n\n' +
        chalk.hex('#ffa502')('⚡ Features:') + '\n' +
        chalk.hex('#95afc0')('  • Automatic dependency installation') + '\n' +
        chalk.hex('#95afc0')('  • Environment file creation from templates') + '\n' +
        chalk.hex('#95afc0')('  • Git repository initialization') + '\n' +
        chalk.hex('#95afc0')('  • Usage tracking and history') + '\n' +
        chalk.hex('#95afc0')('  • Offline mode with cached templates'), {
        padding: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        backgroundColor: '#0a0a0a'
    }));
}
export async function cloneRepo(userRepo, projectName, options = {}) {
    const startTime = Date.now();
    const cacheManager = new CacheManager();
    // Check for help flag
    if (userRepo === '--help' || userRepo === '-h') {
        showCloneHelp();
        return;
    }
    // Handle "." as project name - use current directory name
    let actualProjectName = projectName;
    if (projectName === '.') {
        actualProjectName = path.basename(process.cwd());
        console.log(chalk.cyan(`Using current directory name: ${chalk.bold(actualProjectName)}`));
    }
    // Parse additional options from arguments
    const args = process.argv.slice(3);
    const cloneOptions = {
        offline: args.includes('--offline'),
        noDeps: args.includes('--no-deps'),
        noGit: args.includes('--no-git'),
        ...options
    };
    try {
        const result = await cloneRepoUtil(userRepo, actualProjectName, cloneOptions);
        // Track the clone operation in history
        if (result) {
            await cacheManager.addProjectToHistory({
                name: result.projectName || actualProjectName || 'unknown',
                path: projectName === '.' ? process.cwd() : path.resolve(process.cwd(), result.projectName),
                framework: 'cloned',
                language: 'unknown',
                features: [],
                createdAt: new Date().toISOString()
            });
            // Track command completion
            const duration = Date.now() - startTime;
            await cacheManager.addCommandToHistory({
                command: 'clone',
                args: [userRepo, actualProjectName || ''],
                projectPath: projectName === '.' ? process.cwd() : path.resolve(process.cwd(), result.projectName),
                success: true,
                duration
            });
        }
    }
    catch (error) {
        // Track failed clone attempts
        const duration = Date.now() - startTime;
        await cacheManager.addCommandToHistory({
            command: 'clone',
            args: [userRepo, actualProjectName || ''],
            projectPath: process.cwd(),
            success: false,
            duration
        });
        throw error;
    }
}
