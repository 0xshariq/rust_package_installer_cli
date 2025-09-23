/**
 * Advanced Dashboard Utility
 * Creates beautiful terminal interfaces with advanced styling for Package Installer CLI
 */
import chalk from 'chalk';
import figlet from 'figlet';
import gradientString from 'gradient-string';
import Table from 'cli-table3';
import boxen from 'boxen';
import fs from 'fs-extra';
import path from 'path';
import { detectLanguageFromFiles } from './languageConfig.js';
import { HistoryManager } from './historyManager.js';
/**
 * Create an amazing CLI banner
 */
export function createBanner(title = 'Package Installer CLI') {
    console.clear();
    // Create figlet text with proper title
    const figletText = figlet.textSync(title.length > 15 ? 'Package Installer' : title, {
        font: 'ANSI Shadow',
        horizontalLayout: 'fitted',
        width: 80
    });
    // Apply gradient
    const gradientText = gradientString('cyan', 'magenta', 'yellow')(figletText);
    // Create a box around it
    const banner = boxen(gradientText, {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'cyan',
        backgroundColor: '#1a1a1a'
    });
    console.log(banner);
    // Add tagline with updated branding
    const tagline = chalk.hex('#00d2d3')('🚀 Advanced Project Analytics Dashboard');
    const version = chalk.hex('#95afc0')('v3.0.0');
    const author = chalk.hex('#ffa502')('by @0xshariq');
    const centered = `${tagline} ${version} ${author}`;
    const padding = Math.max(0, Math.floor(((process.stdout.columns || 80) - centered.length) / 2));
    console.log(' '.repeat(padding) + centered);
    console.log();
}
/**
 * Display project statistics in a beautiful table
 */
export function displayProjectStats(stats) {
    console.log(gradientString('cyan', 'magenta')('📊 PROJECT STATISTICS\n'));
    // Main stats table
    const statsTable = new Table({
        head: [
            chalk.hex('#00d2d3')('Metric'),
            chalk.hex('#10ac84')('Value'),
            chalk.hex('#ffa502')('Details')
        ],
        colWidths: [25, 15, 40],
        style: {
            head: [],
            border: ['cyan']
        }
    });
    statsTable.push([
        chalk.white('🏗️  Total Projects'),
        chalk.green(stats.totalProjects.toString()),
        chalk.gray('Projects created with CLI')
    ], [
        chalk.white('📝 Languages Used'),
        chalk.blue(Object.keys(stats.languageBreakdown).length.toString()),
        chalk.gray(Object.keys(stats.languageBreakdown).join(', ') || 'No data')
    ], [
        chalk.white('🎯 Frameworks Used'),
        chalk.cyan(Object.keys(stats.frameworkBreakdown).length.toString()),
        chalk.gray(Object.keys(stats.frameworkBreakdown).join(', ') || 'No data')
    ], [
        chalk.white('⚡ Total Commands'),
        chalk.yellow(stats.totalCommands.toString()),
        chalk.gray('CLI commands executed')
    ], [
        chalk.white('🔥 Usage Streak'),
        chalk.magenta(stats.usageStreak.toString() + ' days'),
        chalk.gray('Consecutive days of usage')
    ], [
        chalk.white('📅 Last Used'),
        chalk.greenBright(stats.lastUsed || 'Never'),
        chalk.gray('Most recent CLI activity')
    ]);
    console.log(statsTable.toString());
    // Display command breakdown if available
    if (Object.keys(stats.commandBreakdown).length > 0) {
        console.log('\n' + gradientString('green', 'blue')('🎮 COMMAND USAGE BREAKDOWN\n'));
        const commandTable = new Table({
            head: [
                chalk.hex('#10ac84')('Command'),
                chalk.hex('#00d2d3')('Count'),
                chalk.hex('#ffa502')('Percentage'),
                chalk.hex('#ff6b6b')('Usage Bar')
            ],
            style: {
                head: [],
                border: ['green']
            }
        });
        const totalCommands = Object.values(stats.commandBreakdown).reduce((sum, count) => sum + count, 0);
        Object.entries(stats.commandBreakdown)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .forEach(([command, count]) => {
            const percentage = ((count / totalCommands) * 100).toFixed(1);
            const barLength = Math.round((count / totalCommands) * 20);
            const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
            commandTable.push([
                chalk.white(command),
                chalk.cyan(count.toString()),
                chalk.green(percentage + '%'),
                chalk.hex('#74b9ff')(bar)
            ]);
        });
        console.log(commandTable.toString());
    }
    // Language breakdown pie chart (text-based)
    if (Object.keys(stats.languageBreakdown).length > 0) {
        console.log('\n' + gradientString('yellow', 'red')('🎯 LANGUAGE BREAKDOWN\n'));
        const total = Object.values(stats.languageBreakdown).reduce((a, b) => a + b, 0);
        const langTable = new Table({
            head: [
                chalk.hex('#ffa502')('Language'),
                chalk.hex('#00d2d3')('Projects'),
                chalk.hex('#10ac84')('Percentage'),
                chalk.hex('#95afc0')('Visual')
            ],
            style: {
                head: [],
                border: ['yellow']
            }
        });
        for (const [lang, count] of Object.entries(stats.languageBreakdown)) {
            const percentage = ((count / total) * 100).toFixed(1);
            const barLength = Math.round((count / total) * 20);
            const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
            langTable.push([
                getLanguageIcon(lang) + ' ' + chalk.white(lang),
                chalk.cyan(count.toString()),
                chalk.green(percentage + '%'),
                chalk.hex('#00d2d3')(bar)
            ]);
        }
        console.log(langTable.toString());
    }
    // Framework breakdown display
    if (Object.keys(stats.frameworkBreakdown).length > 0) {
        console.log('\n' + gradientString('magenta', 'cyan')('🎯 FRAMEWORK BREAKDOWN\n'));
        const total = Object.values(stats.frameworkBreakdown).reduce((a, b) => a + b, 0);
        const frameworkTable = new Table({
            head: [
                chalk.hex('#ff6b6b')('Framework'),
                chalk.hex('#00d2d3')('Projects'),
                chalk.hex('#10ac84')('Percentage'),
                chalk.hex('#95afc0')('Visual')
            ],
            style: {
                head: [],
                border: ['magenta']
            }
        });
        for (const [framework, count] of Object.entries(stats.frameworkBreakdown)) {
            const percentage = ((count / total) * 100).toFixed(1);
            const barLength = Math.round((count / total) * 20);
            const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
            frameworkTable.push([
                getFrameworkIcon(framework) + ' ' + chalk.white(framework),
                chalk.cyan(count.toString()),
                chalk.green(percentage + '%'),
                chalk.hex('#ff6b6b')(bar)
            ]);
        }
        console.log(frameworkTable.toString());
    }
}
/**
 * Display recent projects in a beautiful format
 */
export function displayRecentProjects(projects) {
    if (projects.length === 0)
        return;
    console.log('\n' + gradientString('green', 'blue')('📂 RECENT PROJECTS\n'));
    const projectTable = new Table({
        head: [
            chalk.hex('#10ac84')('Project'),
            chalk.hex('#00d2d3')('Language'),
            chalk.hex('#ffa502')('Framework'),
            chalk.hex('#95afc0')('Size'),
            chalk.hex('#ff6b6b')('Last Modified')
        ],
        style: {
            head: [],
            border: ['green']
        }
    });
    projects.slice(0, 10).forEach(project => {
        projectTable.push([
            chalk.white('📁 ' + project.name),
            getLanguageIcon(project.language) + ' ' + chalk.cyan(project.language),
            chalk.yellow(project.framework || 'N/A'),
            chalk.magenta(formatFileSize(project.size)),
            chalk.gray(formatDate(project.lastModified))
        ]);
    });
    console.log(projectTable.toString());
}
/**
 * Display feature usage statistics from history
 */
export function displayFeatureUsageFromHistory(featureStats) {
    console.log('\n' + gradientString('orange', 'red')('🎯 FEATURE USAGE\n'));
    if (featureStats.length === 0) {
        console.log(chalk.gray('   No features used yet. Use \'pi add\' to add features to projects.\n'));
        return;
    }
    const featureTable = new Table({
        head: [
            chalk.cyan('Feature'),
            chalk.cyan('Usage Count'),
            chalk.cyan('Frameworks'),
            chalk.cyan('Popularity')
        ],
        colWidths: [18, 15, 25, 15],
        style: {
            head: ['cyan'],
            border: ['dim']
        },
        chars: {
            'top': '─',
            'top-mid': '┬',
            'top-left': '┌',
            'top-right': '┐',
            'bottom': '─',
            'bottom-mid': '┴',
            'bottom-left': '└',
            'bottom-right': '┘',
            'left': '│',
            'left-mid': '├',
            'mid': '─',
            'mid-mid': '┼',
            'right': '│',
            'right-mid': '┤',
            'middle': '│'
        }
    });
    featureStats.slice(0, 5).forEach((feature) => {
        const icon = getFeatureIcon(feature.feature);
        const popularity = '█'.repeat(Math.ceil((feature.count / Math.max(...featureStats.map(f => f.count))) * 10));
        featureTable.push([
            `${icon} ${feature.feature}`,
            chalk.green(feature.count.toString()),
            feature.frameworks.join(', '),
            chalk.blue(popularity)
        ]);
    });
    console.log(featureTable.toString());
}
/**
 * Display project statistics from history
 */
export function displayProjectStatsFromHistory(history) {
    console.log('\n' + gradientString('cyan', 'blue')('📊 PROJECT STATISTICS\n'));
    const stats = history.statistics;
    const frameworks = new Map();
    const languages = new Map();
    // Calculate framework and language usage
    history.projects.forEach((project) => {
        frameworks.set(project.framework, (frameworks.get(project.framework) || 0) + 1);
        languages.set(project.language, (languages.get(project.language) || 0) + 1);
    });
    const projectTable = new Table({
        head: [
            chalk.cyan('Metric'),
            chalk.cyan('Value'),
            chalk.cyan('Details')
        ],
        colWidths: [25, 15, 40],
        style: {
            head: ['cyan'],
            border: ['dim']
        },
        chars: {
            'top': '─',
            'top-mid': '┬',
            'top-left': '┌',
            'top-right': '┐',
            'bottom': '─',
            'bottom-mid': '┴',
            'bottom-left': '└',
            'bottom-right': '┘',
            'left': '│',
            'left-mid': '├',
            'mid': '─',
            'mid-mid': '┼',
            'right': '│',
            'right-mid': '┤',
            'middle': '│'
        }
    });
    projectTable.push([
        '🏗️  Total Projects',
        chalk.green(stats.totalProjectsCreated.toString()),
        'Projects created with CLI'
    ]);
    projectTable.push([
        '⚡ Features Added',
        chalk.blue(stats.totalFeaturesAdded.toString()),
        'Total features installed'
    ]);
    if (stats.mostUsedFramework) {
        projectTable.push([
            '🎯 Top Framework',
            chalk.yellow(stats.mostUsedFramework),
            `Most popular framework`
        ]);
    }
    if (stats.mostUsedLanguage) {
        projectTable.push([
            '🔤 Top Language',
            chalk.magenta(stats.mostUsedLanguage),
            `Most used language`
        ]);
    }
    if (stats.mostUsedFeature) {
        projectTable.push([
            '🚀 Top Feature',
            chalk.cyan(stats.mostUsedFeature),
            `Most added feature`
        ]);
    }
    console.log(projectTable.toString());
}
/**
 * Display recent projects from history
 */
export function displayRecentProjectsFromHistory(recentProjects) {
    console.log('\n' + gradientString('green', 'teal')('📁 RECENT PROJECTS\n'));
    if (recentProjects.length === 0) {
        console.log(chalk.gray('   No projects found. Create your first project with \'pi create\'.\n'));
        return;
    }
    const projectTable = new Table({
        head: [
            chalk.cyan('Project'),
            chalk.cyan('Framework'),
            chalk.cyan('Language'),
            chalk.cyan('Features'),
            chalk.cyan('Created')
        ],
        colWidths: [20, 15, 12, 25, 12],
        style: {
            head: ['cyan'],
            border: ['dim']
        },
        chars: {
            'top': '─',
            'top-mid': '┬',
            'top-left': '┌',
            'top-right': '┐',
            'bottom': '─',
            'bottom-mid': '┴',
            'bottom-left': '└',
            'bottom-right': '┘',
            'left': '│',
            'left-mid': '├',
            'mid': '─',
            'mid-mid': '┼',
            'right': '│',
            'right-mid': '┤',
            'middle': '│'
        }
    });
    recentProjects.slice(0, 5).forEach((project) => {
        const createdDate = new Date(project.createdAt).toLocaleDateString();
        const features = project.features?.length > 0 ? project.features.join(', ') : 'None';
        projectTable.push([
            chalk.white(project.name),
            chalk.yellow(project.framework),
            chalk.blue(project.language),
            chalk.gray(features.length > 20 ? features.substring(0, 20) + '...' : features),
            chalk.gray(createdDate)
        ]);
    });
    console.log(projectTable.toString());
}
/**
 * Get icon for feature
 */
function getFeatureIcon(featureName) {
    const icons = {
        'auth': '🔐',
        'docker': '🐳',
        'testing': '🧪',
        'ui': '🎨',
        'api': '🚀',
        'pwa': '📱',
        'monitoring': '📊'
    };
    return icons[featureName] || '⚡';
}
/**
 * Display available commands in a beautiful grid
 */
export function displayCommandsGrid() {
    console.log('\n' + gradientString('purple', 'pink')('🎯 AVAILABLE COMMANDS\n'));
    const commands = [
        {
            name: 'create',
            description: 'Create new projects from templates',
            icon: '🏗️',
            color: '#00d2d3'
        },
        {
            name: 'analyze',
            description: 'Analyze project structure and dependencies',
            icon: '🔍',
            color: '#9c88ff'
        },
        {
            name: 'update',
            description: 'Update packages to latest versions',
            icon: '�',
            color: '#ff6b6b'
        },
        {
            name: 'add',
            description: 'Add features to existing projects',
            icon: '➕',
            color: '#ffa502'
        },
        {
            name: 'check',
            description: 'Check project health and issues',
            icon: '�',
            color: '#54a0ff'
        },
        {
            name: 'clean',
            description: 'Clean development artifacts',
            icon: '🧹',
            color: '#00d2d3'
        },
        {
            name: 'clone',
            description: 'Clone and setup repositories',
            icon: '�',
            color: '#10ac84'
        },
        {
            name: 'deploy',
            description: 'Deploy projects to platforms (Coming Soon)',
            icon: '🚀',
            color: '#ff9ff3'
        },
        {
            name: 'doctor',
            description: 'Diagnose and fix project issues',
            icon: '🩺',
            color: '#00d2d3'
        },
        {
            name: 'env',
            description: 'Manage environment variables',
            icon: '🌍',
            color: '#10ac84'
        },
        {
            name: 'upgrade-cli',
            description: 'Upgrade CLI to latest version',
            icon: '⬆️',
            color: '#5f27cd'
        }
    ];
    const commandTable = new Table({
        head: [
            chalk.hex('#ff6b6b')('Command'),
            chalk.hex('#00d2d3')('Description'),
            chalk.hex('#10ac84')('Usage')
        ],
        colWidths: [15, 40, 25],
        style: {
            head: [],
            border: ['magenta']
        }
    });
    commands.forEach(cmd => {
        commandTable.push([
            chalk.hex(cmd.color)(cmd.icon + ' ' + cmd.name),
            chalk.white(cmd.description),
            chalk.gray(`pi ${cmd.name}`)
        ]);
    });
    console.log(commandTable.toString());
}
/**
 * Create an interactive system info panel
 */
export function displaySystemInfo() {
    console.log('\n' + gradientString('orange', 'red')('💻 SYSTEM INFORMATION\n'));
    const systemTable = new Table({
        head: [
            chalk.hex('#ffa502')('Property'),
            chalk.hex('#00d2d3')('Value')
        ],
        colWidths: [20, 40],
        style: {
            head: [],
            border: ['yellow']
        }
    });
    systemTable.push([chalk.white('🖥️  Platform'), chalk.cyan(process.platform)], [chalk.white('⚡ Node Version'), chalk.green(process.version)], [chalk.white('📁 Working Directory'), chalk.gray(process.cwd().replace(process.env.HOME || '', '~'))], [chalk.white('🔧 Architecture'), chalk.blue(process.arch)], [chalk.white('💾 Memory Usage'), chalk.magenta(formatMemory(process.memoryUsage().heapUsed))]);
    console.log(systemTable.toString());
}
/**
 * Create a beautiful loading animation
 */
export function createLoadingAnimation(message) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    return setInterval(() => {
        process.stdout.write('\r' + chalk.hex('#00d2d3')(frames[i]) + ' ' + chalk.white(message));
        i = (i + 1) % frames.length;
    }, 100);
}
/**
 * Display success message with celebration
 */
export function displaySuccessMessage(message, details) {
    const box = boxen(`${chalk.green('✨ SUCCESS! ✨')}\n\n${chalk.white(message)}${details ? '\n\n' + details.map(d => chalk.gray('• ' + d)).join('\n') : ''}`, {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'green',
        backgroundColor: '#0a3d0a'
    });
    console.log('\n' + box);
}
/**
 * Display error message with helpful information
 */
export function displayErrorMessage(message, suggestions) {
    const box = boxen(`${chalk.red('❌ ERROR! ❌')}\n\n${chalk.white(message)}${suggestions ? '\n\n' + chalk.yellow('Suggestions:') + '\n' +
        suggestions.map(s => chalk.gray('• ' + s)).join('\n') : ''}`, {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'red',
        backgroundColor: '#3d0a0a'
    });
    console.log('\n' + box);
}
/**
 * Create a progress bar
 */
export function createProgressBar(current, total, width = 40) {
    const percentage = current / total;
    const filled = Math.round(width * percentage);
    const empty = width - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    const percent = (percentage * 100).toFixed(1);
    return `${chalk.hex('#00d2d3')(bar)} ${chalk.white(percent)}% (${current}/${total})`;
}
// Helper functions
function getLanguageIcon(language) {
    const icons = {
        'nodejs': '🟢',
        'typescript': '🔵',
        'javascript': '🟡',
        'rust': '🦀',
        'python': '🐍',
        'go': '🐹',
        'java': '☕',
        'php': '🐘',
        'ruby': '💎',
        'nextjs': '⚫',
        'reactjs': '⚛️',
        'vuejs': '💚',
        'angularjs': '🅰️',
        'express': '🚂',
        'nestjs': '🔴'
    };
    return icons[language.toLowerCase()] || '📄';
}
function getFrameworkIcon(framework) {
    const icons = {
        'next.js': '⚫',
        'nextjs': '⚫',
        'react': '⚛️',
        'reactjs': '⚛️',
        'vue.js': '💚',
        'vue': '💚',
        'vuejs': '💚',
        'angular': '🅰️',
        'angularjs': '🅰️',
        'express': '🚂',
        'express.js': '🚂',
        'nestjs': '🔴',
        'nest.js': '🔴',
        'rust': '🦀',
        'django': '🐍',
        'flask': '🐍',
        'spring': '🍃',
        'laravel': '🔴'
    };
    return icons[framework.toLowerCase()] || '🏗️';
}
function formatFileSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0)
        return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
function formatMemory(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}
function formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1)
        return 'Today';
    if (diffDays === 2)
        return 'Yesterday';
    if (diffDays <= 7)
        return `${diffDays} days ago`;
    return date.toLocaleDateString();
}
/**
 * Detect project languages in a directory
 */
async function detectProjectLanguage(projectPath) {
    try {
        const files = await fs.readdir(projectPath);
        const detectionResults = detectLanguageFromFiles(files);
        return detectionResults
            .filter(result => result.confidence > 50)
            .sort((a, b) => b.confidence - a.confidence)
            .map(result => result.language);
    }
    catch (error) {
        return [];
    }
}
/**
 * Get project statistics from workspace
 */
/**
 * Detect project framework based on configuration files
 */
async function detectProjectFramework(projectPath) {
    try {
        // Check for Next.js
        if (await fs.pathExists(path.join(projectPath, 'next.config.js')) ||
            await fs.pathExists(path.join(projectPath, 'next.config.mjs')) ||
            await fs.pathExists(path.join(projectPath, 'next.config.ts'))) {
            return 'Next.js';
        }
        // Check for Angular
        if (await fs.pathExists(path.join(projectPath, 'angular.json'))) {
            return 'Angular';
        }
        // Check for Vue
        if (await fs.pathExists(path.join(projectPath, 'vue.config.js')) ||
            await fs.pathExists(path.join(projectPath, 'vite.config.js'))) {
            const packageJson = path.join(projectPath, 'package.json');
            if (await fs.pathExists(packageJson)) {
                const pkg = await fs.readJson(packageJson);
                if (pkg.dependencies?.vue || pkg.devDependencies?.vue) {
                    return 'Vue.js';
                }
                if (pkg.dependencies?.react || pkg.devDependencies?.react) {
                    return 'React';
                }
            }
        }
        // Check for Express
        const packageJson = path.join(projectPath, 'package.json');
        if (await fs.pathExists(packageJson)) {
            const pkg = await fs.readJson(packageJson);
            if (pkg.dependencies?.express || pkg.devDependencies?.express) {
                return 'Express';
            }
        }
        // Check for Rust
        if (await fs.pathExists(path.join(projectPath, 'Cargo.toml'))) {
            return 'Rust';
        }
        return null;
    }
    catch (error) {
        return null;
    }
}
export async function gatherProjectStats(workspacePath = process.cwd()) {
    const stats = {
        totalProjects: 0,
        languageBreakdown: {},
        frameworkBreakdown: {},
        recentProjects: [],
        featuresUsed: [],
        totalCommands: 0,
        commandBreakdown: {},
        usageStreak: 0,
        lastUsed: 'Never'
    };
    try {
        // Load real data from history.json in .package-installer-cli folder
        const historyManager = new HistoryManager();
        await historyManager.init();
        const data = historyManager.getHistory();
        if (data) {
            // Get project statistics
            const projects = data.projects || [];
            stats.totalProjects = projects.length;
            // Extract recent project names (last 5)
            stats.recentProjects = projects
                .slice(-5)
                .map((p) => p.name || 'Unnamed Project')
                .reverse();
            // Calculate language breakdown from projects
            projects.forEach((project) => {
                if (project.language) {
                    stats.languageBreakdown[project.language] = (stats.languageBreakdown[project.language] || 0) + 1;
                }
            });
            // Calculate framework breakdown from projects
            projects.forEach((project) => {
                if (project.framework) {
                    stats.frameworkBreakdown[project.framework] = (stats.frameworkBreakdown[project.framework] || 0) + 1;
                }
            });
            // Get feature statistics
            const features = data.features || [];
            stats.featuresUsed = features
                .slice(-10)
                .map((f) => f.name || 'Unknown Feature')
                .filter((name) => name !== 'Unknown Feature');
            // Get command statistics using historyManager methods
            const commandStats = historyManager.getCommandStats();
            commandStats.forEach(stat => {
                stats.commandBreakdown[stat.command] = stat.count;
            });
            stats.totalCommands = Object.values(stats.commandBreakdown).reduce((sum, count) => sum + count, 0);
            // Calculate usage streak and last used
            const allEvents = [...projects, ...features];
            if (allEvents.length > 0) {
                const dates = allEvents
                    .map((event) => new Date(event.createdAt || event.addedAt || event.timestamp))
                    .filter((date) => !isNaN(date.getTime()))
                    .sort((a, b) => b.getTime() - a.getTime());
                if (dates.length > 0) {
                    stats.lastUsed = formatRelativeTime(dates[0]);
                    stats.usageStreak = calculateUsageStreak(dates);
                }
            }
        }
        // If in a project directory, detect current project info
        try {
            const languages = await detectProjectLanguage(workspacePath);
            languages.forEach((lang) => {
                stats.languageBreakdown[lang] = (stats.languageBreakdown[lang] || 0) + 1;
            });
            const framework = await detectProjectFramework(workspacePath);
            if (framework) {
                stats.frameworkBreakdown[framework] = (stats.frameworkBreakdown[framework] || 0) + 1;
            }
        }
        catch (error) {
            // Ignore if not in a valid project directory
        }
    }
    catch (error) {
        console.warn('Warning: Could not load analytics data:', error.message || error);
        // Return stats with all zeros - no dummy data
    }
    return stats;
}
/**
 * Helper functions for analytics
 */
function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 60)
        return `${diffMinutes} minutes ago`;
    if (diffHours < 24)
        return `${diffHours} hours ago`;
    if (diffDays === 1)
        return 'Yesterday';
    if (diffDays < 7)
        return `${diffDays} days ago`;
    if (diffDays < 30)
        return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365)
        return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}
function calculateUsageStreak(dates) {
    if (dates.length === 0)
        return 0;
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < dates.length - 1; i++) {
        const current = new Date(dates[i]);
        const next = new Date(dates[i + 1]);
        current.setHours(0, 0, 0, 0);
        next.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            streak++;
        }
        else if (diffDays > 1) {
            break;
        }
    }
    return streak;
}
/**
 * Scan for recent projects in common directories
 */
export async function scanForRecentProjects() {
    const projects = [];
    const commonDirs = [
        path.join(process.env.HOME || '', 'Desktop'),
        path.join(process.env.HOME || '', 'Documents'),
        path.join(process.env.HOME || '', 'Projects'),
        path.join(process.env.HOME || '', 'Code'),
        process.cwd()
    ];
    for (const dir of commonDirs) {
        try {
            if (await fs.pathExists(dir)) {
                const entries = await fs.readdir(dir, { withFileTypes: true });
                for (const entry of entries.slice(0, 20)) { // Limit to prevent too much scanning
                    if (entry.isDirectory()) {
                        const projectPath = path.join(dir, entry.name);
                        // Check if it's a valid project
                        const hasPackageJson = await fs.pathExists(path.join(projectPath, 'package.json'));
                        const hasCargoToml = await fs.pathExists(path.join(projectPath, 'Cargo.toml'));
                        const hasRequirementsTxt = await fs.pathExists(path.join(projectPath, 'requirements.txt'));
                        if (hasPackageJson || hasCargoToml || hasRequirementsTxt) {
                            const stats = await fs.stat(projectPath);
                            const languages = await detectProjectLanguage(projectPath);
                            projects.push({
                                name: entry.name,
                                path: projectPath,
                                language: languages[0] || 'unknown',
                                lastModified: stats.mtime,
                                size: stats.size
                            });
                        }
                    }
                }
            }
        }
        catch (error) {
            // Continue if directory can't be read
        }
    }
    return projects.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime()).slice(0, 10);
}
