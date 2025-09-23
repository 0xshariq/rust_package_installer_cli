import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { logError } from './ui.js';
const execAsync = promisify(exec);
export async function cloneRepo(userRepo, projectName, options = {}) {
    try {
        // Validate and process repository format
        let repoUrl = userRepo;
        let provider = 'github'; // default
        if (!userRepo.startsWith('http') && !userRepo.startsWith('git@')) {
            // Handle provider prefixes
            if (userRepo.includes(':')) {
                const [providerPrefix, repo] = userRepo.split(':', 2);
                switch (providerPrefix.toLowerCase()) {
                    case 'github':
                        provider = 'github';
                        repoUrl = repo;
                        break;
                    case 'gitlab':
                        provider = 'gitlab';
                        repoUrl = repo;
                        break;
                    case 'bitbucket':
                        provider = 'bitbucket';
                        repoUrl = repo;
                        break;
                    case 'sourcehut':
                    case 'sr.ht':
                        provider = 'sourcehut';
                        repoUrl = repo;
                        break;
                    default:
                        // If it's not a recognized provider, treat it as part of the repo name
                        repoUrl = userRepo;
                        break;
                }
            }
            // Validate user/repo format
            if (!repoUrl.includes('/') || repoUrl.split('/').length !== 2) {
                throw new Error(`Invalid repository format: "${userRepo}"\n` +
                    'Expected formats:\n' +
                    '  • user/repo (defaults to GitHub)\n' +
                    '  • github:user/repo\n' +
                    '  • gitlab:user/repo\n' +
                    '  • bitbucket:user/repo\n' +
                    '  • sourcehut:user/repo\n' +
                    '  • https://github.com/user/repo.git');
            }
            const [user, repo] = repoUrl.split('/');
            if (!user || !repo) {
                throw new Error('Invalid repository format. Both user and repo names are required');
            }
        }
        else {
            // Handle full URLs - extract provider info
            if (userRepo.includes('gitlab.com')) {
                provider = 'gitlab';
            }
            else if (userRepo.includes('bitbucket.org')) {
                provider = 'bitbucket';
            }
            else if (userRepo.includes('git.sr.ht')) {
                provider = 'sourcehut';
            }
        }
        const targetDir = projectName || (repoUrl.includes('/') ? repoUrl.split('/')[1] : repoUrl.split('/').pop()?.replace('.git', ''));
        const targetPath = path.resolve(process.cwd(), targetDir || 'cloned-repo');
        // Check if directory already exists
        if (await fs.pathExists(targetPath)) {
            throw new Error(`Directory "${targetDir}" already exists. Please choose a different name or remove the existing directory.`);
        }
        console.log('\n' + chalk.hex('#00d2d3')('🌟 Starting repository clone...'));
        console.log(`${chalk.hex('#ffa502')('Repository:')} ${chalk.hex('#00d2d3')(userRepo)}`);
        console.log(`${chalk.hex('#ffa502')('Provider:')} ${chalk.hex('#9c88ff')(provider.toUpperCase())}`);
        console.log(`${chalk.hex('#ffa502')('Target:')} ${chalk.hex('#95afc0')(targetDir)}`);
        const spinner = ora(chalk.hex('#00d2d3')('🔄 Cloning repository...')).start();
        try {
            // Check if degit is available, if not try to use npx
            let degitCommand = '';
            try {
                await execAsync('degit --version');
                degitCommand = 'degit';
            }
            catch {
                // Fallback to npx degit
                degitCommand = 'npx degit';
            }
            // Build the repository URL for degit
            let degitRepo = repoUrl;
            // Add provider prefix for non-GitHub providers
            if (provider !== 'github') {
                switch (provider) {
                    case 'gitlab':
                        degitRepo = `gitlab:${repoUrl}`;
                        break;
                    case 'bitbucket':
                        degitRepo = `bitbucket:${repoUrl}`;
                        break;
                    case 'sourcehut':
                        degitRepo = `git.sr.ht/${repoUrl}`;
                        break;
                }
            }
            const fullCommand = `${degitCommand} ${degitRepo} ${targetDir}`;
            spinner.text = chalk.hex('#00d2d3')(`Executing: ${fullCommand}`);
            await execAsync(fullCommand, {
                cwd: process.cwd(),
                timeout: 60000 // 60 second timeout
            });
            spinner.succeed(chalk.hex('#10ac84')(`✅ Repository cloned successfully from ${provider.toUpperCase()}`));
            // Install dependencies if package.json exists
            if (!options.noDeps) {
                await installDependenciesForClone(targetPath, targetDir || 'cloned-repo');
            }
            // Create .env file from templates
            await createEnvFile(targetPath);
            // Initialize git repository
            if (!options.noGit) {
                await initializeGitRepository(targetPath, targetDir || 'cloned-repo');
            }
            // Show success message
            showCloneSuccessMessage(targetDir || 'cloned-repo', userRepo);
            // Return result for history tracking
            return {
                projectName: targetDir || 'cloned-repo',
                provider: provider
            };
        }
        catch (error) {
            spinner.fail(chalk.red('Failed to clone repository'));
            if (error.message.includes('not found') || error.message.includes('404')) {
                throw new Error(`Repository ${userRepo} not found or is private`);
            }
            else {
                throw new Error(`Failed to clone repository: ${error.message}`);
            }
        }
    }
    catch (error) {
        logError('Clone failed', error);
        console.log('\n' + chalk.hex('#00d2d3')('📝 Supported formats:'));
        console.log('  ' + chalk.hex('#95afc0')('GitHub (default):'));
        console.log('    ' + chalk.hex('#10ac84')('pi clone facebook/react my-app'));
        console.log('    ' + chalk.hex('#10ac84')('pi clone github:vercel/next.js'));
        console.log('  ' + chalk.hex('#95afc0')('GitLab:'));
        console.log('    ' + chalk.hex('#ff6b6b')('pi clone gitlab:user/project'));
        console.log('  ' + chalk.hex('#95afc0')('BitBucket:'));
        console.log('    ' + chalk.hex('#9c88ff')('pi clone bitbucket:user/repo'));
        console.log('  ' + chalk.hex('#95afc0')('SourceHut:'));
        console.log('    ' + chalk.hex('#ffa502')('pi clone sourcehut:user/repo'));
        console.log('  ' + chalk.hex('#95afc0')('Full URLs:'));
        console.log('    ' + chalk.hex('#00d2d3')('pi clone https://github.com/user/repo.git'));
        console.log('    ' + chalk.hex('#00d2d3')('pi clone https://gitlab.com/user/project.git'));
        return null;
    }
}
async function createEnvFile(targetPath) {
    try {
        const envSpinner = ora(chalk.blue('Creating .env file...')).start();
        // Look for .env template files
        const envTemplateFiles = await fs.readdir(targetPath);
        const envTemplates = envTemplateFiles.filter(file => file.startsWith('.env.') && file !== '.env');
        if (envTemplates.length === 0) {
            envSpinner.info(chalk.gray('No .env template files found'));
            return;
        }
        // Collect all environment variables from template files
        const envVars = new Set();
        for (const templateFile of envTemplates) {
            const templatePath = path.join(targetPath, templateFile);
            const content = await fs.readFile(templatePath, 'utf-8');
            // Extract variable names from template files
            const lines = content.split('\n');
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith('#')) {
                    const [key] = trimmedLine.split('=');
                    if (key) {
                        envVars.add(key.trim());
                    }
                }
            }
        }
        if (envVars.size > 0) {
            // Create .env file with empty values
            const envContent = Array.from(envVars)
                .sort()
                .map(key => `${key}=`)
                .join('\n');
            const envPath = path.join(targetPath, '.env');
            await fs.writeFile(envPath, envContent + '\n');
            envSpinner.succeed(chalk.green(`Created .env file with ${envVars.size} variables`));
        }
        else {
            envSpinner.info(chalk.gray('No environment variables found in template files'));
        }
    }
    catch (error) {
        // Don't fail the whole process if .env creation fails
        console.log(chalk.yellow('⚠️  Could not create .env file automatically'));
    }
}
async function initializeGitRepository(targetPath, targetDir) {
    const gitSpinner = ora(chalk.hex('#00d2d3')('🔧 Initializing git repository...')).start();
    try {
        // Try to initialize git repository using MCP server commands first
        try {
            gitSpinner.text = chalk.hex('#00d2d3')('Initializing git with ginit...');
            await execAsync('ginit', { cwd: targetPath });
        }
        catch {
            gitSpinner.text = chalk.hex('#00d2d3')('Initializing git with git init...');
            await execAsync('git init', { cwd: targetPath });
        }
        // Add all files to git
        try {
            gitSpinner.text = chalk.hex('#00d2d3')('Adding files with gadd...');
            await execAsync('gadd', { cwd: targetPath });
        }
        catch {
            gitSpinner.text = chalk.hex('#00d2d3')('Adding files with git add...');
            await execAsync('git add .', { cwd: targetPath });
        }
        // Make initial commit
        try {
            gitSpinner.text = chalk.hex('#00d2d3')('Creating initial commit with gcommit...');
            await execAsync('gcommit "Initial Commit from Package Installer CLI"', { cwd: targetPath });
        }
        catch {
            gitSpinner.text = chalk.hex('#00d2d3')('Creating initial commit with git commit...');
            await execAsync('git commit -m "Initial Commit from Package Installer CLI - Cloned Repository"', { cwd: targetPath });
        }
        gitSpinner.succeed(chalk.hex('#10ac84')('✅ Git repository initialized with initial commit'));
    }
    catch (error) {
        gitSpinner.warn(chalk.hex('#ffa502')('⚠️  Could not initialize git repository automatically'));
        console.log(chalk.hex('#95afc0')('💡 You can initialize git manually:'));
        console.log(chalk.hex('#95afc0')(`   cd ${targetDir}`));
        console.log(chalk.hex('#95afc0')('   git init'));
        console.log(chalk.hex('#95afc0')('   git add .'));
        console.log(chalk.hex('#95afc0')('   git commit -m "Initial commit"'));
    }
}
async function installDependenciesForClone(projectPath, projectName) {
    const { installProjectDependencies } = await import('./dependencyInstaller.js');
    await installProjectDependencies(projectPath, projectName, true); // Install MCP server for cloned projects
}
function showCloneSuccessMessage(projectName, githubRepo) {
    console.log('\n' + chalk.hex('#10ac84')('✨ Repository cloned successfully!'));
    console.log('');
    console.log(chalk.hex('#00d2d3')('📁 Project Details:'));
    console.log(`   ${chalk.hex('#ffa502')('Repository:')} ${chalk.hex('#00d2d3')(githubRepo)}`);
    console.log(`   ${chalk.hex('#ffa502')('Project Name:')} ${chalk.hex('#9c88ff')(projectName)}`);
    console.log(`   ${chalk.hex('#ffa502')('Location:')} ${chalk.hex('#95afc0')(path.resolve(process.cwd(), projectName))}`);
    console.log('');
    console.log(chalk.hex('#00d2d3')('🚀 Next Steps:'));
    console.log(`   ${chalk.hex('#95afc0')('1.')} cd ${projectName}`);
    console.log(`   ${chalk.hex('#95afc0')('2.')} Read the README.md for project-specific instructions`);
    console.log(`   ${chalk.hex('#95afc0')('3.')} Start exploring and building! 🎉`);
    console.log('');
    console.log(chalk.hex('#ffa502')('💡 Pro Tip: Check package.json scripts for available commands'));
    console.log('');
}
