import chalk from 'chalk';
import path from 'path';
import { cloneRepo as cloneRepoUtil } from '../utils/cloneUtils.js';
import { CacheManager } from '../utils/cacheUtils.js';
import { createStandardHelp } from '../utils/helpFormatter.js';
/**
 * Display help for clone command using standardized format
 */
export function showCloneHelp() {
    const helpConfig = {
        commandName: 'Clone',
        emoji: '📥',
        description: 'Clone any public repository from GitHub, GitLab, BitBucket, or SourceHut.\nAutomatically installs dependencies, creates .env files, and tracks usage.',
        usage: [
            'clone <user/repo> [project-name] [options]',
            'clone [options]'
        ],
        options: [
            { flag: '-h, --help', description: 'Display help for this command' },
            { flag: '--offline', description: 'Use cached templates if available' },
            { flag: '--no-deps', description: 'Skip dependency installation' },
            { flag: '--no-git', description: 'Skip git initialization' },
            { flag: '--shallow', description: 'Create shallow clone (faster)' },
            { flag: '--branch <name>', description: 'Clone specific branch' },
            { flag: '--template', description: 'Treat as template repository' }
        ],
        examples: [
            { command: 'clone facebook/react', description: 'Clone from GitHub' },
            { command: 'clone facebook/react my-app', description: 'Clone with custom name' },
            { command: 'clone gitlab:user/project', description: 'Clone from GitLab' },
            { command: 'clone bitbucket:user/repo', description: 'Clone from BitBucket' },
            { command: 'clone sourcehut:user/repo', description: 'Clone from SourceHut' },
            { command: 'clone user/repo --offline', description: 'Use cached version' },
            { command: 'clone user/repo --no-deps', description: 'Skip dependencies' },
            { command: 'clone user/repo --shallow', description: 'Shallow clone' }
        ],
        additionalSections: [
            {
                title: 'Supported Platforms',
                items: [
                    'GitHub (default): user/repo',
                    'GitLab: gitlab:user/repo',
                    'BitBucket: bitbucket:user/repo',
                    'SourceHut: sourcehut:user/repo'
                ]
            },
            {
                title: 'Features',
                items: [
                    'Automatic dependency installation',
                    'Environment file creation from templates',
                    'Git repository initialization',
                    'Usage tracking and history',
                    'Offline mode with cached templates',
                    'Shallow cloning for faster downloads',
                    'Branch-specific cloning'
                ]
            }
        ],
        tips: [
            'Use --offline flag for cached repositories to work without internet',
            'Shallow clones are faster but have limited git history'
        ]
    };
    createStandardHelp(helpConfig);
}
export async function cloneRepo(userRepo, projectName, options = {}) {
    const startTime = Date.now();
    const cacheManager = new CacheManager();
    // Check for help flag
    if (options.help || options['-h'] || options['--help']) {
        showCloneHelp();
        return;
    }
    // Handle "." as project name - use current directory name
    let actualProjectName = projectName;
    if (projectName === '.') {
        actualProjectName = path.basename(process.cwd());
        console.log(chalk.cyan(`Using current directory name: ${chalk.bold(actualProjectName)}`));
    }
    // Configure clone options from passed options
    const cloneOptions = {
        offline: options.offline || false,
        noDeps: options.noDeps || options['no-deps'] || false,
        noGit: options.noGit || options['no-git'] || false,
        shallow: options.shallow || false,
        branch: options.branch || null,
        template: options.template || false,
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
