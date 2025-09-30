/**
 * Cache Command - Manage Package Installer CLI cache system
 */
import chalk from 'chalk';
import gradientString from 'gradient-string';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import ora from 'ora';
import { createStandardHelp } from '../utils/helpFormatter.js';
import { getDirectorySize, getCacheStats, getCacheStatus } from '../utils/cacheManager.js';
/**
 * Display help for cache command
 */
export function showCacheHelp() {
    const helpConfig = {
        commandName: 'Cache',
        emoji: '🗄️',
        description: 'Manage CLI cache system for improved performance.\nAutomatically manages cached data for faster operations.',
        usage: [
            'cache [subcommand] [type]',
            'cache [options]'
        ],
        options: [
            { flag: '--stats', description: 'Show cache statistics' },
            { flag: '--clear [type]', description: 'Clear cache (optional type)' },
            { flag: '--info', description: 'Show cache information' },
            { flag: '--optimize', description: 'Optimize cache' },
            { flag: '--size', description: 'Show cache size only' }
        ],
        examples: [
            { command: 'cache stats', description: 'Show cache statistics' },
            { command: 'cache --stats', description: 'Show cache statistics (flag)' },
            { command: 'cache clear', description: 'Clear all cache' },
            { command: 'cache clear projects', description: 'Clear specific cache type' },
            { command: 'cache info', description: 'Show cache information' },
            { command: 'cache optimize', description: 'Optimize cache performance' },
            { command: 'cache --size', description: 'Show cache size only' }
        ],
        additionalSections: [
            {
                title: 'Subcommands',
                items: [
                    'stats - Show cache statistics and usage info',
                    'clear [type] - Clear cache (all or specific type)',
                    'info - Show cache configuration and paths',
                    'optimize - Optimize cache performance'
                ]
            },
            {
                title: 'Cache Types',
                items: [
                    'projects - Project metadata and analysis',
                    'analysis - Analysis results and reports',
                    'packages - Package version information',
                    'templates - Template usage statistics',
                    'system - System environment information',
                    'all - Clear all cache types'
                ]
            }
        ],
        tips: [
            'Cache improves CLI performance by storing frequently used data',
            'Cache is automatically managed but you can manually optimize it',
            'Use --size to check cache disk usage before clearing'
        ]
    };
    createStandardHelp(helpConfig);
}
/**
 * Main cache command function
 */
export async function cacheCommand(subcommand, type, options = {}) {
    // Handle help flag
    if (options.help || options['--help'] || options['-h'] || subcommand === '--help' || subcommand === '-h') {
        showCacheHelp();
        return;
    }
    // Handle option flags
    if (options.stats || subcommand === 'stats') {
        await cacheStatsCommand();
        return;
    }
    if (options.clear !== undefined || subcommand === 'clear') {
        const clearType = options.clear || type;
        await cacheClearCommand(clearType);
        return;
    }
    if (options.info || subcommand === 'info') {
        await cacheInfoCommand();
        return;
    }
    if (options.optimize || subcommand === 'optimize') {
        await cacheOptimizeCommand();
        return;
    }
    if (options.size) {
        await cacheSizeCommand();
        return;
    }
    // Handle subcommands
    if (subcommand === 'stats') {
        await cacheStatsCommand();
    }
    else if (subcommand === 'clear') {
        await cacheClearCommand(type);
    }
    else if (subcommand === 'info') {
        await cacheInfoCommand();
    }
    else if (subcommand === 'optimize') {
        await cacheOptimizeCommand();
    }
    else {
        // Default cache command - show help and quick stats
        console.clear();
        console.log(gradientString(['#00d2d3', '#0084ff'])('🗄️  Cache Manager\n'));
        console.log(chalk.cyan('Available commands:'));
        console.log(chalk.gray('   pi cache stats        - Show cache statistics'));
        console.log(chalk.gray('   pi cache clear        - Clear all cache'));
        console.log(chalk.gray('   pi cache clear <type> - Clear specific cache type'));
        console.log(chalk.gray('   pi cache info         - Show cache configuration'));
        console.log(chalk.gray('   pi cache optimize     - Optimize cache performance'));
        console.log(chalk.gray('   pi cache --help       - Show detailed help'));
        console.log(chalk.cyan('\nCache types:'));
        console.log(chalk.gray('   projects, templates, analysis, packages, system, all'));
        // Show quick stats
        try {
            const stats = getCacheStats();
            console.log(chalk.cyan('\nQuick Stats:'));
            console.log(chalk.gray(`   Cached Projects: ${stats.projects?.length || 0}`));
            console.log(chalk.gray(`   Template Files: ${stats.templateFiles?.size || Object.keys(stats.templateFiles || {}).length || 0}`));
            // Show cache size
            const cacheDir = path.join(os.homedir(), '.pi-cache');
            if (await fs.pathExists(cacheDir)) {
                const size = await getDirectorySize(cacheDir);
                console.log(chalk.gray(`   Cache Size: ${(size / 1024 / 1024).toFixed(2)} MB`));
            }
        }
        catch (error) {
            console.log(chalk.yellow('\n⚠️  Cache not initialized yet'));
        }
        console.log(chalk.green('\n✅ Cache system ready'));
        console.log(chalk.gray('💡 Use --help for detailed options'));
    }
}
/**
 * Cache stats subcommand
 */
async function cacheStatsCommand() {
    console.log(gradientString(['#00d2d3', '#0084ff'])('\n🗄️  Cache Statistics\n'));
    const spinner = ora('Loading cache statistics...').start();
    try {
        const stats = getCacheStats();
        const status = getCacheStatus();
        spinner.succeed('Cache statistics loaded');
        console.log(chalk.cyan('📊 Cache Information:'));
        console.log(chalk.gray(`   Cache Status: ${status.initialized ? 'Initialized' : 'Not Initialized'}`));
        console.log(chalk.gray(`   Cache Version: ${status.version || 'Unknown'}`));
        console.log(chalk.gray(`   Total Projects: ${stats.projects?.length || 0}`));
        console.log(chalk.gray(`   Total Templates: ${stats.templateFiles?.size || 0}`));
        console.log(chalk.gray(`   Cache Hits: ${stats.hits || 0}`));
        console.log(chalk.gray(`   Cache Misses: ${stats.misses || 0}`));
        // Cache hit ratio
        const totalRequests = (stats.hits || 0) + (stats.misses || 0);
        const hitRatio = totalRequests > 0 ? ((stats.hits || 0) / totalRequests * 100).toFixed(1) : '0';
        console.log(chalk.gray(`   Hit Ratio: ${hitRatio}%`));
        // Storage information
        const cacheDir = path.join(os.homedir(), '.pi-cache');
        if (await fs.pathExists(cacheDir)) {
            const size = await getDirectorySize(cacheDir);
            console.log(chalk.gray(`   Cache Size: ${(size / 1024 / 1024).toFixed(2)} MB`));
        }
        console.log(chalk.green('\n✅ Cache system is functioning properly'));
    }
    catch (error) {
        spinner.fail('Failed to load cache statistics');
        console.error(chalk.red(`❌ Error: ${error.message}`));
    }
}
/**
 * Cache clear subcommand
 */
async function cacheClearCommand(type) {
    console.log(gradientString(['#00d2d3', '#0084ff'])('\n🗑️  Cache Cleaner\n'));
    const spinner = ora('Clearing cache...').start();
    try {
        const cacheDir = path.join(os.homedir(), '.pi-cache');
        if (type) {
            // Clear specific cache type
            const cacheFile = path.join(cacheDir, 'cache.json');
            if (await fs.pathExists(cacheFile)) {
                const cache = await fs.readJson(cacheFile);
                switch (type) {
                    case 'projects':
                        cache.projects = [];
                        break;
                    case 'templates':
                        cache.templateFiles = {};
                        break;
                    case 'analysis':
                        cache.analysis = {};
                        break;
                    case 'packages':
                        cache.packages = {};
                        break;
                    default:
                        spinner.fail(`Unknown cache type: ${type}`);
                        return;
                }
                await fs.writeJson(cacheFile, cache, { spaces: 2 });
                spinner.succeed(`Cleared ${type} cache`);
            }
            else {
                spinner.warn('Cache file not found');
            }
        }
        else {
            // Clear all cache
            if (await fs.pathExists(cacheDir)) {
                await fs.remove(cacheDir);
                spinner.succeed('All cache cleared');
            }
            else {
                spinner.warn('Cache directory not found');
            }
        }
        console.log(chalk.green('✅ Cache cleared successfully'));
    }
    catch (error) {
        spinner.fail('Failed to clear cache');
        console.error(chalk.red(`❌ Error: ${error.message}`));
    }
}
/**
 * Cache info subcommand
 */
async function cacheInfoCommand() {
    console.log(gradientString(['#00d2d3', '#0084ff'])('\n🔧 Cache Configuration\n'));
    const os = require('os');
    const path = require('path');
    const cacheDir = path.join(os.homedir(), '.pi-cache');
    const cacheFile = path.join(cacheDir, 'cache.json');
    console.log(chalk.cyan('Cache Configuration:'));
    console.log(chalk.gray(`   Cache Directory: ${cacheDir}`));
    console.log(chalk.gray(`   Cache File: ${cacheFile}`));
    console.log(chalk.gray(`   Cache Version: 1.0.0`));
    // Check if cache file exists
    const fs = require('fs-extra');
    const exists = await fs.pathExists(cacheFile);
    console.log(chalk.gray(`   Cache File Exists: ${exists ? 'Yes' : 'No'}`));
    if (exists) {
        try {
            const stats = await fs.stat(cacheFile);
            const size = (stats.size / 1024).toFixed(2);
            const modified = stats.mtime.toLocaleString();
            console.log(chalk.gray(`   File Size: ${size} KB`));
            console.log(chalk.gray(`   Last Modified: ${modified}`));
        }
        catch (error) {
            console.log(chalk.red(`   Error reading cache file: ${error.message}`));
        }
    }
    console.log(chalk.cyan('\nCache Types:'));
    console.log(chalk.gray('   • projects     - Project metadata and analysis'));
    console.log(chalk.gray('   • analysis     - Project analysis results'));
    console.log(chalk.gray('   • packages     - Package version information'));
    console.log(chalk.gray('   • templates    - Template usage statistics'));
    console.log(chalk.gray('   • templateFiles - Cached template file contents'));
    console.log(chalk.gray('   • system       - System environment info'));
}
/**
 * Cache size subcommand
 */
async function cacheSizeCommand() {
    console.log(gradientString(['#00d2d3', '#0084ff'])('\n📊 Cache Size Information\n'));
    const spinner = ora('Calculating cache size...').start();
    try {
        const cacheDir = path.join(os.homedir(), '.pi-cache');
        if (!await fs.pathExists(cacheDir)) {
            spinner.warn('Cache directory not found');
            console.log(chalk.yellow('⚠️  Cache has not been initialized yet'));
            return;
        }
        const totalSize = await getDirectorySize(cacheDir);
        const cacheFile = path.join(cacheDir, 'cache.json');
        spinner.succeed('Cache size calculated');
        console.log(chalk.cyan('📁 Cache Size Breakdown:'));
        console.log(chalk.gray(`   Total Cache Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`));
        if (await fs.pathExists(cacheFile)) {
            const cacheFileStats = await fs.stat(cacheFile);
            console.log(chalk.gray(`   Cache Data File: ${(cacheFileStats.size / 1024).toFixed(2)} KB`));
        }
        // Show cache efficiency
        if (totalSize > 50 * 1024 * 1024) { // 50MB
            console.log(chalk.yellow('\n⚠️  Cache is quite large (>50MB)'));
            console.log(chalk.gray('💡 Consider running "pi cache optimize" or "pi cache clear"'));
        }
        else if (totalSize > 10 * 1024 * 1024) { // 10MB
            console.log(chalk.cyan('\n💡 Cache size is reasonable'));
            console.log(chalk.gray('Consider optimizing if performance is slow'));
        }
        else {
            console.log(chalk.green('\n✅ Cache size is optimal'));
        }
    }
    catch (error) {
        spinner.fail('Failed to calculate cache size');
        console.error(chalk.red(`❌ Error: ${error.message}`));
    }
}
/**
 * Cache optimize subcommand
 */
async function cacheOptimizeCommand() {
    console.log(gradientString(['#00d2d3', '#0084ff'])('\n⚡ Cache Optimizer\n'));
    const spinner = ora('Optimizing cache...').start();
    try {
        const cacheDir = path.join(os.homedir(), '.pi-cache');
        const cacheFile = path.join(cacheDir, 'cache.json');
        if (!await fs.pathExists(cacheFile)) {
            spinner.warn('Cache file not found');
            return;
        }
        const cache = await fs.readJson(cacheFile);
        let optimized = false;
        // Remove expired entries (older than 7 days)
        const expireTime = Date.now() - (7 * 24 * 60 * 60 * 1000);
        if (cache.projects) {
            const originalCount = cache.projects.length;
            cache.projects = cache.projects.filter((project) => !project.timestamp || project.timestamp > expireTime);
            if (cache.projects.length < originalCount) {
                optimized = true;
                spinner.text = `Removed ${originalCount - cache.projects.length} expired projects`;
            }
        }
        // Clean up empty template files
        if (cache.templateFiles) {
            const originalKeys = Object.keys(cache.templateFiles);
            Object.keys(cache.templateFiles).forEach(key => {
                if (!cache.templateFiles[key] || cache.templateFiles[key].trim() === '') {
                    delete cache.templateFiles[key];
                    optimized = true;
                }
            });
            if (Object.keys(cache.templateFiles).length < originalKeys.length) {
                spinner.text = `Cleaned ${originalKeys.length - Object.keys(cache.templateFiles).length} empty templates`;
            }
        }
        // Compact cache file
        if (optimized) {
            await fs.writeJson(cacheFile, cache, { spaces: 2 });
            spinner.succeed('Cache optimization complete');
            console.log(chalk.green('✅ Cache optimized successfully'));
        }
        else {
            spinner.succeed('Cache is already optimized');
        }
        // Show optimization results
        const stats = await fs.stat(cacheFile);
        console.log(chalk.gray(`📁 Cache size: ${(stats.size / 1024).toFixed(2)} KB`));
        console.log(chalk.cyan('\n💡 Tip: Run "pi cache clear" to manually clear specific cache types'));
    }
    catch (error) {
        spinner.fail('Failed to optimize cache');
        console.error(chalk.red(`❌ Error: ${error.message}`));
    }
}
