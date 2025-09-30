/**
 * Analyze command - Advanced terminal dashboard showing Package Installer CLI usage analytics
 */
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import gradientString from 'gradient-string';
import boxen from 'boxen';
import { createStandardHelp } from '../utils/helpFormatter.js';
import { displayCommandBanner } from '../utils/banner.js';
import { displaySystemInfo, displaySuccessMessage } from '../utils/dashboard.js';
import { HistoryManager } from '../utils/historyManager.js';
/**
 * Display help for analyze command using standardized format
 */
export function showAnalyzeHelp() {
    const helpConfig = {
        commandName: 'Analyze',
        emoji: '📊',
        description: 'Display comprehensive CLI usage analytics and project dashboard.\nInteractive dashboard showing Package Installer CLI usage statistics, project analytics, recent activities, and development environment info.',
        usage: [
            'analyze [options]',
            'stats [options]   # alias'
        ],
        options: [
            { flag: '--export', description: 'Export analytics data to JSON file' },
            { flag: '--reset', description: 'Reset analytics history' },
            { flag: '--detailed', description: 'Show detailed analytics breakdown' }
        ],
        examples: [
            { command: 'analyze', description: 'Show complete analytics dashboard' },
            { command: 'analyze --detailed', description: 'Show detailed breakdown with more metrics' },
            { command: 'analyze --export', description: 'Export analytics data to JSON file' },
            { command: 'analyze --reset', description: 'Clear all analytics history' },
            { command: 'stats', description: 'Use alias command' }
        ],
        additionalSections: [
            {
                title: 'Features',
                items: [
                    '📈 Command Usage Stats - Frequency and trends of CLI commands',
                    '🚀 Project Analytics - Created projects and framework breakdown',
                    '📁 Recent Activity - Last created/modified projects timeline',
                    '🎯 Feature Usage - Most used features and integrations',
                    '⚙️ Environment Info - Development environment overview',
                    '📊 Performance - CLI performance metrics and insights'
                ]
            }
        ],
        tips: [
            'Analytics data is collected from ~/.package-installer-cli/history.json',
            'Use --export to backup your analytics data',
            'Use --reset to start fresh analytics tracking'
        ]
    };
    createStandardHelp(helpConfig);
}
/**
 * Main analyze command function
 */
export async function analyzeCommand(options = {}) {
    // Show help if help flag is present
    if (options.help || options['--help'] || options['-h']) {
        showAnalyzeHelp();
        return;
    }
    displayCommandBanner('Analytics', 'Comprehensive project analytics and usage insights');
    const historyManager = new HistoryManager();
    try {
        // Load analytics data from history.json
        const historyData = await loadAnalyticsData();
        // Handle specific options
        if (options.export) {
            await exportAnalyticsData(historyData);
            return;
        }
        if (options.reset) {
            await resetAnalyticsData();
            return;
        }
        // Display dashboard
        if (options.detailed) {
            await displayDetailedAnalyticsDashboard(historyData);
        }
        else {
            await displayAnalyticsDashboard(historyData);
        }
    }
    catch (error) {
        console.error(chalk.red('❌ Failed to load analytics:'), error);
        displaySuccessMessage('Package Installer CLI Analytics Dashboard', ['No data available yet - start using the CLI to see analytics!', 'Use commands like "pi create", "pi add", "pi clone" to generate data']);
    }
}
/**
 * Load analytics data from history.json
 */
async function loadAnalyticsData() {
    const historyPath = path.join(os.homedir(), '.package-installer-cli', 'history.json');
    if (!await fs.pathExists(historyPath)) {
        return {
            commands: {},
            projects: [],
            features: [],
            statistics: {
                totalCommands: 0,
                totalProjects: 0,
                totalFeatures: 0,
                frameworks: {},
                languages: {}
            }
        };
    }
    return await fs.readJson(historyPath);
}
/**
 * Display analytics dashboard
 */
async function displayAnalyticsDashboard(data) {
    console.log('\n');
    // Show summary overview first
    displaySummaryOverview(data);
    // Display command usage statistics
    displayCommandStatistics(data);
    // Display project statistics
    displayProjectStatistics(data);
    // Display feature usage
    displayFeatureUsage(data);
    // Display recent activity
    displayRecentActivity(data);
    // Display performance insights
    displayPerformanceInsights(data);
    // Display system info
    displaySystemInfo();
}
/**
 * Display detailed analytics dashboard with more metrics
 */
async function displayDetailedAnalyticsDashboard(data) {
    console.log('\n');
    // Show summary overview first
    displaySummaryOverview(data);
    // Display command usage statistics with trends
    displayDetailedCommandStatistics(data);
    // Display detailed project statistics
    displayDetailedProjectStatistics(data);
    // Display feature usage breakdown
    displayDetailedFeatureUsage(data);
    // Display time-based analytics
    displayTimeBasedAnalytics(data);
    // Display recent activity with more details
    displayDetailedRecentActivity(data);
    // Display performance insights
    displayPerformanceInsights(data);
    // Display system info
    displaySystemInfo();
}
/**
 * Display summary overview
 */
function displaySummaryOverview(data) {
    const totalCommands = data.statistics?.totalCommands || 0;
    const totalProjects = data.statistics?.totalProjects || 0;
    const totalFeatures = data.statistics?.totalFeatures || 0;
    const uniqueFrameworks = Object.keys(data.statistics?.frameworks || {}).length;
    const uniqueLanguages = Object.keys(data.statistics?.languages || {}).length;
    console.log(boxen(gradientString(['#e056fd', '#f18a8a'])('🎯 Package Installer CLI Usage Summary') + '\n\n' +
        chalk.white('Total Commands Executed: ') + chalk.cyan(totalCommands) + '\n' +
        chalk.white('Projects Created: ') + chalk.green(totalProjects) + '\n' +
        chalk.white('Features Used: ') + chalk.yellow(totalFeatures) + '\n' +
        chalk.white('Frameworks Explored: ') + chalk.blue(uniqueFrameworks) + '\n' +
        chalk.white('Languages Used: ') + chalk.magenta(uniqueLanguages) + '\n\n' +
        chalk.gray('Your coding journey with Package Installer CLI'), {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: 'round',
        borderColor: 'magenta'
    }));
}
/**
 * Display command usage statistics
 */
function displayCommandStatistics(data) {
    const commands = data.commands || {};
    const totalCommands = data.statistics?.totalCommands || 0;
    const commandEntries = Object.entries(commands);
    console.log(boxen(gradientString(['#4facfe', '#00f2fe'])('📊 Command Usage Statistics') + '\n\n' +
        (totalCommands > 0 && commandEntries.length > 0
            ? commandEntries
                .sort(([, a], [, b]) => b - a)
                .slice(0, 8)
                .map(([cmd, count]) => {
                const percentage = ((count / totalCommands) * 100).toFixed(1);
                const maxCount = Math.max(...Object.values(commands).map(c => Number(c)));
                const barLength = Math.min(Math.ceil((count / maxCount) * 30), 30);
                const bar = '█'.repeat(barLength);
                return chalk.white(`  ${cmd.padEnd(15)} `) +
                    chalk.cyan(bar.padEnd(30)) +
                    chalk.gray(` ${count} (${percentage}%)`);
            }).join('\n') + '\n\n' +
                chalk.gray(`Total commands executed: ${totalCommands}`)
            : chalk.gray('  No command usage data available yet\n  Start using the CLI to see your most used commands!')), {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: 'round',
        borderColor: 'cyan'
    }));
}
/**
 * Display detailed command statistics with trends
 */
function displayDetailedCommandStatistics(data) {
    const commands = data.commands || {};
    const totalCommands = data.statistics?.totalCommands || 0;
    const commandEntries = Object.entries(commands);
    console.log(boxen(gradientString(['#4facfe', '#00f2fe'])('📊 Detailed Command Usage Statistics') + '\n\n' +
        (totalCommands > 0 && commandEntries.length > 0
            ? commandEntries
                .sort(([, a], [, b]) => b - a)
                .map(([cmd, count], index) => {
                const percentage = ((count / totalCommands) * 100).toFixed(1);
                const maxCount = Math.max(...Object.values(commands).map(c => Number(c)));
                const barLength = Math.min(Math.ceil((count / maxCount) * 25), 25);
                const bar = '█'.repeat(barLength);
                const rank = index + 1;
                const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '  ';
                return `${rankEmoji} ${chalk.white(cmd.padEnd(18))} ` +
                    chalk.cyan(bar.padEnd(25)) +
                    chalk.gray(` ${count} uses (${percentage}%)`);
            }).join('\n') + '\n\n' +
                chalk.gray(`Total: ${totalCommands} commands • Average: ${(totalCommands / commandEntries.length).toFixed(1)} per command`)
            : chalk.gray('  No command usage data available yet')), {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: 'round',
        borderColor: 'cyan'
    }));
}
/**
 * Display project statistics
 */
/**
 * Display performance insights
 */
function displayPerformanceInsights(data) {
    const commands = data.commands || {};
    const projects = data.projects || [];
    const features = data.features || [];
    const totalCommands = Object.values(commands).reduce((sum, count) => sum + Number(count), 0);
    const productivityScore = calculateProductivityScore(totalCommands, projects.length, features.length);
    console.log(boxen(gradientString(['#74b9ff', '#00b894'])('⚡ Performance Insights') + '\n\n' +
        chalk.white(`Productivity Score: `) + chalk.green(`${productivityScore}/100`) + '\n' +
        chalk.white(`Commands per Project: `) + chalk.blue((projects.length > 0 ? (totalCommands / projects.length).toFixed(1) : '0')) + '\n' +
        chalk.white(`Features per Project: `) + chalk.cyan((projects.length > 0 ? (features.length / projects.length).toFixed(1) : '0')) + '\n\n' +
        chalk.gray('💡 ') + chalk.white(getProductivityTip(productivityScore)), {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: 'round',
        borderColor: 'blue'
    }));
}
/**
 * Display time-based analytics
 */
function displayTimeBasedAnalytics(data) {
    const projects = data.projects || [];
    const features = data.features || [];
    const allEvents = [...projects, ...features];
    const timeStats = analyzeTimePatterns(allEvents);
    console.log(boxen(gradientString(['#fd79a8', '#fdcb6e'])('📅 Time-Based Analytics') + '\n\n' +
        chalk.white(`Most Active Day: `) + chalk.yellow(timeStats.mostActiveDay || 'N/A') + '\n' +
        chalk.white(`Most Active Hour: `) + chalk.yellowBright(timeStats.mostActiveHour || 'N/A') + '\n' +
        chalk.white(`Weekly Activity: `) + chalk.green(`${timeStats.weeklyAverage || 0} actions/week`) + '\n\n' +
        chalk.gray('📊 ') + chalk.white(getTimeInsight(timeStats)), {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: 'round',
        borderColor: 'yellow'
    }));
}
/**
 * Display detailed recent activity
 */
function displayDetailedRecentActivity(data) {
    const projects = data.projects || [];
    const features = data.features || [];
    const commands = data.commands || {};
    // Get recent projects (last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentProjects = projects.filter((p) => new Date(p.createdAt || 0).getTime() > thirtyDaysAgo);
    const recentFeatures = features.filter((f) => new Date(f.createdAt || 0).getTime() > thirtyDaysAgo);
    console.log(boxen(gradientString(['#6c5ce7', '#a29bfe'])('📈 Detailed Recent Activity (Last 30 Days)') + '\n\n' +
        chalk.white(`Recent Projects: `) + chalk.cyan(recentProjects.length) + '\n' +
        chalk.white(`Recent Features: `) + chalk.magenta(recentFeatures.length) + '\n' +
        chalk.white(`Total CLI Commands: `) + chalk.green(Object.values(commands).reduce((sum, count) => sum + Number(count), 0)) + '\n\n' +
        (recentProjects.length > 0
            ? chalk.white('Latest Projects:\n') +
                recentProjects
                    .slice(0, 5)
                    .map((p) => chalk.gray(`  • ${p.name || 'Unnamed'} (${getTimeAgo(p.createdAt)})`))
                    .join('\n') + '\n\n'
            : chalk.gray('No recent projects\n\n')) +
        (recentFeatures.length > 0
            ? chalk.white('Latest Features:\n') +
                recentFeatures
                    .slice(0, 5)
                    .map((f) => chalk.gray(`  • ${f.name || 'Unnamed'} (${getTimeAgo(f.createdAt)})`))
                    .join('\n')
            : chalk.gray('No recent features')), {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: 'round',
        borderColor: 'magenta'
    }));
}
/**
 * Helper functions for analytics
 */
function calculateProductivityScore(totalCommands, projectCount, featureCount) {
    let score = 0;
    // Command usage (0-40 points)
    score += Math.min(40, totalCommands * 2);
    // Project diversity (0-30 points)
    score += Math.min(30, projectCount * 5);
    // Feature adoption (0-30 points)
    score += Math.min(30, featureCount * 3);
    return Math.round(score);
}
function getProductivityTip(score) {
    if (score >= 80)
        return 'Excellent CLI usage! You\'re maximizing productivity.';
    if (score >= 60)
        return 'Good productivity! Try exploring more features.';
    if (score >= 40)
        return 'Moderate usage. Consider using more CLI commands.';
    if (score >= 20)
        return 'Getting started! Explore more commands and features.';
    return 'Just beginning your journey. Run "pi --help" to discover more!';
}
function analyzeTimePatterns(events) {
    if (events.length === 0)
        return {};
    const dayCount = {};
    const hourCount = {};
    events.forEach(event => {
        if (event.createdAt) {
            const date = new Date(event.createdAt);
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            const hour = date.getHours();
            dayCount[day] = (dayCount[day] || 0) + 1;
            hourCount[hour] = (hourCount[hour] || 0) + 1;
        }
    });
    const mostActiveDay = Object.entries(dayCount)
        .sort(([, a], [, b]) => b - a)[0]?.[0];
    const mostActiveHour = Object.entries(hourCount)
        .sort(([, a], [, b]) => b - a)[0]?.[0];
    return {
        mostActiveDay,
        mostActiveHour: mostActiveHour ? `${mostActiveHour}:00` : undefined,
        weeklyAverage: (events.length / Math.max(1, getWeeksSpan(events))).toFixed(1)
    };
}
function getTimeInsight(timeStats) {
    if (!timeStats.mostActiveDay)
        return 'No activity patterns detected yet.';
    const insights = [
        `You're most active on ${timeStats.mostActiveDay}s`,
        timeStats.mostActiveHour ? `Peak activity around ${timeStats.mostActiveHour}` : '',
        `Averaging ${timeStats.weeklyAverage} actions per week`
    ].filter(Boolean);
    return insights.join(' • ');
}
function getWeeksSpan(events) {
    if (events.length === 0)
        return 1;
    const dates = events
        .map(e => new Date(e.createdAt || Date.now()))
        .filter(d => !isNaN(d.getTime()));
    if (dates.length === 0)
        return 1;
    const earliest = Math.min(...dates.map(d => d.getTime()));
    const weeksSpan = Math.max(1, (Date.now() - earliest) / (1000 * 60 * 60 * 24 * 7));
    return weeksSpan;
}
function getProjectsPerMonth(projects) {
    if (projects.length === 0)
        return '0.0';
    const dates = projects
        .map(p => new Date(p.createdAt || Date.now()))
        .filter(d => !isNaN(d.getTime()));
    if (dates.length === 0)
        return '0.0';
    const earliest = Math.min(...dates.map(d => d.getTime()));
    const monthsSpan = Math.max(1, (Date.now() - earliest) / (1000 * 60 * 60 * 24 * 30));
    return (projects.length / monthsSpan).toFixed(1);
}
function getCategoryEmoji(category) {
    const categoryMap = {
        ui: '🎨',
        auth: '🔐',
        database: '🗄️',
        aws: '☁️',
        payment: '💳',
        analytics: '📊',
        monitoring: '📈',
        testing: '🧪',
        docker: '🐳',
        ai: '🤖',
        storage: '💾'
    };
    return categoryMap[category] || '⚡';
}
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0)
        return 'today';
    if (diffDays === 1)
        return 'yesterday';
    if (diffDays < 30)
        return `${diffDays} days ago`;
    if (diffDays < 365)
        return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}
function displayProjectStatistics(data) {
    const projects = data.projects || [];
    const frameworks = data.statistics?.frameworks || {};
    const languages = data.statistics?.languages || {};
    console.log(boxen(gradientString(['#ff6b6b', '#feca57'])('🚀 Project Statistics') + '\n\n' +
        chalk.white(`Total Projects Created: `) + chalk.cyan(projects.length) + '\n\n' +
        (Object.keys(frameworks).length > 0
            ? chalk.white('Most Used Frameworks:\n') +
                Object.entries(frameworks)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([fw, count]) => chalk.white(`  ${fw.padEnd(12)}: `) + chalk.green(count))
                    .join('\n') + '\n\n'
            : chalk.gray('No framework data available\n\n')) +
        (Object.keys(languages).length > 0
            ? chalk.white('Languages Explored:\n') +
                Object.entries(languages)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([lang, count]) => chalk.white(`  ${lang.padEnd(12)}: `) + chalk.yellow(count))
                    .join('\n')
            : chalk.gray('No language data available')), {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: 'round',
        borderColor: 'yellow'
    }));
}
/**
 * Display detailed project statistics
 */
function displayDetailedProjectStatistics(data) {
    const projects = data.projects || [];
    const frameworks = data.statistics?.frameworks || {};
    const languages = data.statistics?.languages || {};
    console.log(boxen(gradientString(['#ff6b6b', '#feca57'])('🚀 Detailed Project Statistics') + '\n\n' +
        chalk.white(`Total Projects Created: `) + chalk.cyan(projects.length) + '\n' +
        chalk.white(`Average Projects per Month: `) + chalk.green(getProjectsPerMonth(projects)) + '\n\n' +
        (Object.keys(frameworks).length > 0
            ? chalk.white('Framework Distribution:\n') +
                Object.entries(frameworks)
                    .sort(([, a], [, b]) => b - a)
                    .map(([fw, count]) => {
                    const percentage = ((count / projects.length) * 100).toFixed(1);
                    return chalk.white(`  ${fw.padEnd(15)}: `) + chalk.green(`${count} (${percentage}%)`);
                }).join('\n') + '\n\n'
            : chalk.gray('No framework data available\n\n')) +
        (Object.keys(languages).length > 0
            ? chalk.white('Language Preferences:\n') +
                Object.entries(languages)
                    .sort(([, a], [, b]) => b - a)
                    .map(([lang, count]) => {
                    const percentage = ((count / projects.length) * 100).toFixed(1);
                    return chalk.white(`  ${lang.padEnd(15)}: `) + chalk.yellow(`${count} (${percentage}%)`);
                }).join('\n')
            : chalk.gray('No language data available')), {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: 'round',
        borderColor: 'yellow'
    }));
}
/**
 * Display feature usage statistics
 */
function displayFeatureUsage(data) {
    const features = data.features || [];
    const featureStats = {};
    // Count feature usage
    features.forEach((feature) => {
        if (feature.name) {
            featureStats[feature.name] = (featureStats[feature.name] || 0) + 1;
        }
    });
    console.log(boxen(gradientString(['#9c88ff', '#f093fb'])('🎯 Feature Usage') + '\n\n' +
        (Object.keys(featureStats).length > 0
            ? Object.entries(featureStats)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 8)
                .map(([feature, count]) => chalk.white(`  ${feature.padEnd(18)}: `) + chalk.magenta(`${count} times`))
                .join('\n')
            : chalk.gray('  No feature usage data available yet\n  Install features with "pi add" to see usage stats!')), {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: 'round',
        borderColor: 'magenta'
    }));
}
/**
 * Display detailed feature usage
 */
function displayDetailedFeatureUsage(data) {
    const features = data.features || [];
    const featureStats = {};
    // Count feature usage and track categories
    features.forEach((feature) => {
        if (feature.name) {
            if (!featureStats[feature.name]) {
                featureStats[feature.name] = {
                    count: 0,
                    category: feature.category || 'misc',
                    lastUsed: feature.createdAt || new Date().toISOString()
                };
            }
            featureStats[feature.name].count++;
        }
    });
    console.log(boxen(gradientString(['#9c88ff', '#f093fb'])('🎯 Detailed Feature Usage Analytics') + '\n\n' +
        (Object.keys(featureStats).length > 0
            ? Object.entries(featureStats)
                .sort(([, a], [, b]) => b.count - a.count)
                .map(([feature, stats]) => {
                const categoryEmoji = getCategoryEmoji(stats.category);
                return `${categoryEmoji} ${chalk.white(feature.padEnd(20))} ` +
                    chalk.magenta(`${stats.count} uses`) +
                    chalk.gray(` • Last: ${getTimeAgo(stats.lastUsed)}`);
            }).join('\n') + '\n\n' +
                chalk.gray(`Total features used: ${Object.keys(featureStats).length}`)
            : chalk.gray('  No feature usage data available yet')), {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: 'round',
        borderColor: 'magenta'
    }));
}
/**
 * Display recent activity
 */
function displayRecentActivity(data) {
    const projects = data.projects || [];
    const recentProjects = projects
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 5);
    console.log(boxen(gradientString(['#a8edea', '#fed6e3'])('📁 Recent Activity') + '\n\n' +
        (recentProjects.length > 0
            ? recentProjects
                .map((project) => chalk.white(`  ${project.name || 'Unknown'} `) +
                chalk.gray(`(${project.framework || 'unknown'})`) +
                (project.createdAt ? '\n    ' + chalk.dim(new Date(project.createdAt).toLocaleDateString()) : '')).join('\n')
            : chalk.gray('  No recent projects')), {
        padding: 1,
        margin: { top: 1, bottom: 1, left: 2, right: 2 },
        borderStyle: 'round',
        borderColor: 'magenta'
    }));
}
/**
 * Export analytics data
 */
async function exportAnalyticsData(data) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `analytics-export-${timestamp}.json`;
    await fs.writeJson(filename, data, { spaces: 2 });
    displaySuccessMessage('Analytics data exported', [`Saved to ${filename}`, 'Contains all CLI usage statistics and project data']);
}
/**
 * Reset analytics data
 */
async function resetAnalyticsData() {
    const historyPath = path.join(os.homedir(), '.package-installer-cli', 'history.json');
    const emptyData = {
        commands: {},
        projects: [],
        features: [],
        statistics: {
            totalCommands: 0,
            totalProjects: 0,
            totalFeatures: 0,
            frameworks: {},
            languages: {}
        }
    };
    await fs.ensureDir(path.dirname(historyPath));
    await fs.writeJson(historyPath, emptyData, { spaces: 2 });
    displaySuccessMessage('Analytics data reset', ['All usage statistics have been cleared', 'Fresh analytics will be collected from now on']);
}
