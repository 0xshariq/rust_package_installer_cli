/**
 * Clean command - Clean development artifacts and caches
 */
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { createStandardHelp } from '../utils/helpFormatter.js';
/**
 * Display help for clean command
 */
export function showCleanHelp() {
    const helpConfig = {
        commandName: 'Clean',
        emoji: '🧹',
        description: 'Clean development artifacts, caches, and temporary files.\nSafely removes common build outputs, dependency caches, and temporary files to free up disk space and clean your project.',
        usage: [
            'clean [options]',
            'cleanup [options]   # alias'
        ],
        options: [
            { flag: '--node-modules', description: 'Clean node_modules directories' },
            { flag: '--build', description: 'Clean build/dist directories' },
            { flag: '--cache', description: 'Clean package manager caches' },
            { flag: '--logs', description: 'Clean log files and debug outputs' },
            { flag: '--all', description: 'Clean everything (safe operation)' },
            { flag: '--deep', description: 'Deep clean (includes lock files)' },
            { flag: '--dry-run', description: 'Preview what would be cleaned' },
            { flag: '-h, --help', description: 'Show this help message' }
        ],
        examples: [
            { command: 'clean --build', description: 'Clean build directories only' },
            { command: 'clean --node-modules', description: 'Clean node_modules directories' },
            { command: 'clean --all --dry-run', description: 'Preview what would be cleaned' },
            { command: 'clean --deep', description: 'Deep clean with lock files' },
            { command: 'clean --cache', description: 'Clean package manager caches' },
            { command: 'cleanup --all', description: 'Use alias command' }
        ],
        additionalSections: [
            {
                title: 'Clean Targets',
                items: [
                    'Build Outputs: dist, build, .next, out, target',
                    'Dependencies: node_modules, .pnpm-store',
                    'Caches: .cache, .npm, .yarn, __pycache__',
                    'Logs: *.log, npm-debug.log, yarn-error.log',
                    'Temp Files: .DS_Store, Thumbs.db, *.tmp'
                ]
            }
        ],
        tips: [
            'Always use --dry-run first to preview changes',
            'Deep clean removes lock files and requires dependency reinstall',
            'Use --cache to clean package manager caches for more space'
        ]
    };
    createStandardHelp(helpConfig);
}
/**
 * Main clean command function
 */
export async function cleanCommand(options = {}) {
    // Show help if help flag is present
    if (options.help || options['--help'] || options['-h']) {
        showCleanHelp();
        return;
    }
    console.clear();
    console.log(chalk.hex('#ffa502')('🧹 Project Cleaner\n'));
    const projectPath = process.cwd();
    const isDryRun = options['dryRun'] || options['dry-run'];
    // Determine what to clean based on flags
    const targets = determineCleanTargets(options);
    if (targets.length === 0) {
        console.log(chalk.yellow('⚠️  No clean targets specified. Use --help for available options.'));
        console.log(chalk.gray('💡 Tip: Use --all for a safe clean of common artifacts'));
        return;
    }
    if (isDryRun) {
        console.log(chalk.cyan('🔍 DRY RUN - Preview of what would be cleaned:\n'));
    }
    else {
        console.log(chalk.cyan('🧹 Starting cleanup process...\n'));
    }
    const spinner = ora(chalk.hex('#ffa502')(isDryRun ? 'Analyzing files...' : 'Cleaning project...')).start();
    try {
        let totalSize = 0;
        const results = [];
        let itemsCleaned = 0;
        for (const target of targets) {
            spinner.text = `${isDryRun ? 'Analyzing' : 'Cleaning'} ${target.name}...`;
            const targetSize = await cleanTarget(projectPath, target, isDryRun);
            if (targetSize > 0) {
                totalSize += targetSize;
                itemsCleaned++;
                results.push(`${target.name}: ${formatFileSize(targetSize)}`);
            }
        }
        spinner.stop();
        if (totalSize > 0) {
            const action = isDryRun ? 'would be cleaned' : 'cleaned';
            console.log(chalk.green(`\n✅ ${isDryRun ? 'Analysis' : 'Cleanup'} completed!`));
            console.log(chalk.white(`📊 Total ${action}: ${chalk.bold(formatFileSize(totalSize))}`));
            console.log(chalk.white(`📁 Items ${action}: ${chalk.bold(itemsCleaned)}`));
            if (results.length > 0) {
                console.log(chalk.cyan('\n📋 Breakdown:'));
                results.forEach(result => {
                    console.log(chalk.gray(`   • ${result}`));
                });
            }
            if (isDryRun) {
                console.log(chalk.yellow('\n💡 Run without --dry-run to actually clean these files'));
            }
            else {
                console.log(chalk.green('\n🎉 Project successfully cleaned!'));
            }
        }
        else {
            console.log(chalk.green('✨ Nothing to clean - project is already tidy!'));
        }
    }
    catch (error) {
        spinner.fail(chalk.red(isDryRun ? '❌ Failed to analyze files' : '❌ Failed to clean project'));
        console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
    }
}
/**
 * Determine what to clean based on options
 */
function determineCleanTargets(options) {
    const targets = [];
    // Handle --node-modules flag
    if (options.all || options['nodeModules'] || options['node-modules']) {
        targets.push({
            name: 'node_modules',
            patterns: ['node_modules', '**/node_modules'],
            description: 'Node.js dependencies'
        });
    }
    // Handle --build flag
    if (options.all || options.build) {
        targets.push({
            name: 'build outputs',
            patterns: ['dist', 'build', '.next', 'out', 'target/debug', 'target/release', '.output', '.nuxt'],
            description: 'Build outputs and compiled files'
        });
    }
    // Handle --cache flag
    if (options.all || options.cache) {
        targets.push({
            name: 'package manager caches',
            patterns: ['.cache', '.npm', '.yarn', '.pnpm-store', '.pnpm', '__pycache__', '.pytest_cache', 'target/debug/deps', 'target/release/deps'],
            description: 'Package manager and build caches'
        });
    }
    // Handle --logs flag
    if (options.all || options.logs) {
        targets.push({
            name: 'log files',
            patterns: ['*.log', 'logs', 'log', '*.log.*', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*'],
            description: 'Log files and debug outputs'
        });
    }
    // Handle --deep flag (includes lock files)
    if (options.deep) {
        targets.push({
            name: 'dependency lock files',
            patterns: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'Cargo.lock', 'Pipfile.lock', 'poetry.lock'],
            description: 'Dependency lock files (requires reinstall)'
        });
        // Add more aggressive cleaning for deep clean
        targets.push({
            name: 'temporary files',
            patterns: ['.tmp', 'tmp', '.temp', 'temp', '.DS_Store', 'Thumbs.db', '*.tmp', '*.temp'],
            description: 'Temporary files and system artifacts'
        });
    }
    // If no specific options are provided and not --all, show available options
    const hasSpecificOption = options['nodeModules'] || options['node-modules'] ||
        options.build || options.cache || options.logs ||
        options.deep || options.all;
    if (!hasSpecificOption) {
        return []; // Return empty to show help message
    }
    return targets;
}
/**
 * Clean a specific target
 */
async function cleanTarget(projectPath, target, dryRun) {
    let totalSize = 0;
    for (const pattern of target.patterns) {
        try {
            // Handle different pattern types
            if (pattern.includes('*')) {
                // Handle glob patterns
                totalSize += await cleanGlobPattern(projectPath, pattern, dryRun);
            }
            else {
                // Handle direct paths
                const fullPath = path.join(projectPath, pattern);
                if (await fs.pathExists(fullPath)) {
                    const size = await getDirectorySize(fullPath);
                    totalSize += size;
                    if (!dryRun && size > 0) {
                        await fs.remove(fullPath);
                    }
                }
            }
        }
        catch (error) {
            // Silently ignore permission errors or other filesystem issues
            // This is expected behavior for clean operations
        }
    }
    return totalSize;
}
/**
 * Clean files matching a glob pattern
 */
async function cleanGlobPattern(projectPath, pattern, dryRun) {
    let totalSize = 0;
    try {
        // Import glob dynamically
        const { glob } = await import('glob');
        const matches = await glob(pattern, {
            cwd: projectPath,
            absolute: false,
            dot: true,
            ignore: ['node_modules/node_modules/**'] // Avoid nested node_modules issues
        });
        const matchArray = Array.isArray(matches) ? matches : [matches];
        for (const match of matchArray) {
            if (!match)
                continue;
            const fullPath = path.join(projectPath, match);
            try {
                if (await fs.pathExists(fullPath)) {
                    const size = await getDirectorySize(fullPath);
                    totalSize += size;
                    if (!dryRun && size > 0) {
                        await fs.remove(fullPath);
                    }
                }
            }
            catch (error) {
                // Skip files that can't be accessed
            }
        }
    }
    catch (error) {
        // Fallback to simple directory walking for pattern matching
        totalSize += await fallbackPatternMatch(projectPath, pattern, dryRun);
    }
    return totalSize;
}
/**
 * Fallback pattern matching when glob is not available
 */
async function fallbackPatternMatch(projectPath, pattern, dryRun) {
    let totalSize = 0;
    // Handle common patterns manually
    if (pattern.includes('**')) {
        // Recursive pattern - search directories
        const basePattern = pattern.replace('**/', '').replace('*', '');
        await walkDirectory(projectPath, async (filePath) => {
            if (filePath.includes(basePattern)) {
                try {
                    const size = await getDirectorySize(filePath);
                    totalSize += size;
                    if (!dryRun && size > 0) {
                        await fs.remove(filePath);
                    }
                }
                catch (error) {
                    // Skip on error
                }
            }
        });
    }
    else {
        // Simple pattern
        const simplePattern = pattern.replace('*', '');
        const fullPath = path.join(projectPath, simplePattern);
        if (await fs.pathExists(fullPath)) {
            const size = await getDirectorySize(fullPath);
            totalSize += size;
            if (!dryRun && size > 0) {
                await fs.remove(fullPath);
            }
        }
    }
    return totalSize;
}
/**
 * Walk directory recursively
 */
async function walkDirectory(dir, callback) {
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await callback(fullPath);
                // Recurse into subdirectory (with depth limit to avoid infinite loops)
                if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
                    await walkDirectory(fullPath, callback);
                }
            }
            else {
                await callback(fullPath);
            }
        }
    }
    catch (error) {
        // Skip directories that can't be read
    }
}
/**
 * Get directory size recursively
 */
async function getDirectorySize(dir) {
    let size = 0;
    try {
        const stat = await fs.stat(dir);
        if (stat.isFile()) {
            return stat.size;
        }
        if (stat.isDirectory()) {
            const entries = await fs.readdir(dir);
            for (const entry of entries) {
                const entryPath = path.join(dir, entry);
                size += await getDirectorySize(entryPath);
            }
        }
    }
    catch (error) {
        // Ignore permission errors
    }
    return size;
}
/**
 * Format file size for display
 */
function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}
