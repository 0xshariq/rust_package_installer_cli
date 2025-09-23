/**
 * Template creation utilities for Package Installer CLI v3.0.0
 * Enhanced with features integration support
 */
import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import ora from 'ora';
const execAsync = promisify(exec);
/**
 * Create a project from a template with progress indicators and error handling
 */
export async function createProjectFromTemplate(options) {
    const { projectName, templatePath } = options;
    const spinner = ora(chalk.hex('#10ac84')('Creating project structure...')).start();
    try {
        // Handle "." as project name - create in current directory
        let projectPath;
        let actualProjectName;
        if (projectName === '.') {
            projectPath = process.cwd();
            actualProjectName = path.basename(process.cwd());
            // Check if current directory is empty
            const currentDirContents = await fs.readdir(projectPath);
            if (currentDirContents.length > 0) {
                const hasImportantFiles = currentDirContents.some(file => !file.startsWith('.') && file !== 'node_modules');
                if (hasImportantFiles) {
                    spinner.fail(chalk.red('Current directory is not empty'));
                    throw new Error('Current directory is not empty. Please use an empty directory or specify a different project name.');
                }
            }
        }
        else {
            projectPath = path.resolve(process.cwd(), projectName);
            actualProjectName = projectName;
            // Check if directory already exists
            if (await fs.pathExists(projectPath)) {
                spinner.fail(chalk.red(`Directory ${projectName} already exists`));
                throw new Error(`Directory ${projectName} already exists`);
            }
        }
        // Validate template path
        if (!await fs.pathExists(templatePath)) {
            spinner.fail(chalk.red(`Template not found at: ${templatePath}`));
            throw new Error(`Template not found at: ${templatePath}`);
        }
        // Check template contents
        const templateContents = await fs.readdir(templatePath);
        if (templateContents.length === 0) {
            spinner.fail(chalk.red('Template directory is empty'));
            throw new Error('Template directory is empty');
        }
        // Copy template files with filtering
        spinner.text = chalk.hex('#00d2d3')('Copying template files...');
        if (projectName === '.') {
            // Copy files directly to current directory
            await copyTemplateFilesToCurrentDir(templatePath, projectPath);
        }
        else {
            // Create directory and copy files
            await fs.ensureDir(projectPath);
            await copyTemplateFiles(templatePath, projectPath);
        }
        spinner.succeed(chalk.green('✅ Project structure created'));
        // Process template files (replace placeholders, etc.)
        await processTemplateFiles(projectPath, actualProjectName);
        // Install dependencies if any configuration files exist
        await installDependenciesForCreate(projectPath);
        return projectPath;
    }
    catch (error) {
        spinner.fail(chalk.red('❌ Failed to create project'));
        throw error;
    }
}
/**
 * Copy template files with intelligent filtering and flattening
 */
async function copyTemplateFiles(templatePath, projectPath) {
    // Check if template has a single subdirectory that should be flattened
    const templateContents = await fs.readdir(templatePath);
    const nonSystemFiles = templateContents.filter(item => !item.startsWith('.') &&
        item !== 'node_modules' &&
        item !== 'dist' &&
        item !== 'build');
    // If template has only one directory, copy its contents instead of the directory itself
    if (nonSystemFiles.length === 1) {
        const singleItem = nonSystemFiles[0];
        const singleItemPath = path.join(templatePath, singleItem);
        const stats = await fs.stat(singleItemPath);
        if (stats.isDirectory()) {
            // Copy contents of the single directory
            await fs.copy(singleItemPath, projectPath, {
                filter: (src, dest) => {
                    const relativePath = path.relative(singleItemPath, src);
                    // Skip common directories that shouldn't be copied
                    if (relativePath.includes('node_modules') ||
                        relativePath.includes('.git') ||
                        relativePath.includes('dist') ||
                        relativePath.includes('build') ||
                        relativePath.includes('.next')) {
                        return false;
                    }
                    // Skip system files
                    const fileName = path.basename(src);
                    if (fileName === '.DS_Store' ||
                        fileName === 'Thumbs.db' ||
                        fileName === '.gitkeep') {
                        return false;
                    }
                    return true;
                }
            });
            return;
        }
    }
    // Default behavior: copy entire template directory
    await fs.copy(templatePath, projectPath, {
        filter: (src, dest) => {
            const relativePath = path.relative(templatePath, src);
            // Skip common directories that shouldn't be copied
            if (relativePath.includes('node_modules') ||
                relativePath.includes('.git') ||
                relativePath.includes('dist') ||
                relativePath.includes('build') ||
                relativePath.includes('.next')) {
                return false;
            }
            // Skip system files
            const fileName = path.basename(src);
            if (fileName === '.DS_Store' ||
                fileName === 'Thumbs.db' ||
                fileName === '.gitkeep') {
                return false;
            }
            return true;
        }
    });
}
/**
 * Copy template files to current directory (for "." project name)
 */
async function copyTemplateFilesToCurrentDir(templatePath, projectPath) {
    const templateContents = await fs.readdir(templatePath);
    for (const item of templateContents) {
        const sourcePath = path.join(templatePath, item);
        const destPath = path.join(projectPath, item);
        const stats = await fs.stat(sourcePath);
        if (stats.isDirectory()) {
            // Skip common directories that shouldn't be copied
            if (item === 'node_modules' || item === '.git' ||
                item === 'dist' || item === 'build' || item === '.next') {
                continue;
            }
            await fs.copy(sourcePath, destPath, {
                filter: (src) => {
                    const fileName = path.basename(src);
                    return fileName !== '.DS_Store' && fileName !== 'Thumbs.db' && fileName !== '.gitkeep';
                }
            });
        }
        else {
            // Skip system files
            if (item === '.DS_Store' || item === 'Thumbs.db' || item === '.gitkeep') {
                continue;
            }
            await fs.copy(sourcePath, destPath);
        }
    }
}
/**
 * Process template files to replace placeholders and customize content
 */
async function processTemplateFiles(projectPath, projectName) {
    try {
        // Process package.json if it exists
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (await fs.pathExists(packageJsonPath)) {
            const packageJson = await fs.readJson(packageJsonPath);
            // Update project name
            packageJson.name = projectName;
            // Update description if it's generic
            if (packageJson.description === 'Template project' ||
                packageJson.description === 'Generated from template') {
                packageJson.description = `${projectName} - Generated by Package Installer CLI`;
            }
            await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        }
        // Process README.md if it exists
        const readmePath = path.join(projectPath, 'README.md');
        if (await fs.pathExists(readmePath)) {
            let readmeContent = await fs.readFile(readmePath, 'utf-8');
            // Replace common placeholders
            readmeContent = readmeContent
                .replace(/{{PROJECT_NAME}}/g, projectName)
                .replace(/{{project-name}}/g, projectName.toLowerCase())
                .replace(/Template Project/g, projectName)
                .replace(/template-project/g, projectName.toLowerCase().replace(/\s+/g, '-'));
            await fs.writeFile(readmePath, readmeContent, 'utf-8');
        }
        // Process other configuration files
        await processConfigurationFiles(projectPath, projectName);
    }
    catch (error) {
        console.warn(chalk.yellow('⚠️  Could not process some template files'));
    }
}
/**
 * Process various configuration files
 */
async function processConfigurationFiles(projectPath, projectName) {
    // Process docker-compose.yml
    const dockerComposePath = path.join(projectPath, 'docker-compose.yml');
    if (await fs.pathExists(dockerComposePath)) {
        let content = await fs.readFile(dockerComposePath, 'utf-8');
        content = content
            .replace(/template-project/g, projectName.toLowerCase().replace(/\s+/g, '-'))
            .replace(/{{PROJECT_NAME}}/g, projectName);
        await fs.writeFile(dockerComposePath, content, 'utf-8');
    }
    // Process .env.example
    const envExamplePath = path.join(projectPath, '.env.example');
    const envExampleAltPath = path.join(projectPath, 'env.example');
    const envExampleFile = await fs.pathExists(envExamplePath) ? envExamplePath :
        await fs.pathExists(envExampleAltPath) ? envExampleAltPath : null;
    if (envExampleFile) {
        let content = await fs.readFile(envExampleFile, 'utf-8');
        content = content
            .replace(/{{PROJECT_NAME}}/g, projectName)
            .replace(/template-project/g, projectName.toLowerCase().replace(/\s+/g, '-'));
        await fs.writeFile(envExampleFile, content, 'utf-8');
        // Create .env file from .env.example
        const envPath = path.join(projectPath, '.env');
        if (!await fs.pathExists(envPath)) {
            await fs.copy(envExampleFile, envPath);
        }
    }
}
/**
 * Install project dependencies with progress indicators
 * Enhanced with better error handling and fallback options
 */
export async function installDependenciesForCreate(projectPath) {
    try {
        // Check if this is a Node.js project
        const packageJsonPath = path.join(projectPath, 'package.json');
        const hasPackageJson = await fs.pathExists(packageJsonPath);
        if (hasPackageJson) {
            console.log(chalk.hex('#10ac84')('📦 Installing dependencies...'));
            const { installProjectDependencies } = await import('./dependencyInstaller.js');
            const projectName = path.basename(projectPath);
            await installProjectDependencies(projectPath, projectName, false); // Don't install MCP server for basic projects
            console.log(chalk.green('✅ Dependencies installed successfully'));
        }
        else {
            console.log(chalk.hex('#95afc0')('📦 No package.json found, skipping dependency installation'));
        }
        // Initialize git repository after dependencies are installed
        await initializeGitRepositoryForCreate(projectPath);
    }
    catch (installError) {
        console.log(chalk.yellow(`⚠️  Auto-installation failed: ${installError.message}`));
        console.log(chalk.yellow('You can install dependencies manually:'));
        try {
            const packageJsonPath = path.join(projectPath, 'package.json');
            if (await fs.pathExists(packageJsonPath)) {
                console.log(chalk.hex('#00d2d3')(`  cd ${path.basename(projectPath)}`));
                console.log(chalk.hex('#00d2d3')('  pnpm install'));
                console.log(chalk.hex('#95afc0')('  (or npm install / yarn install)'));
            }
            // Check for other dependency files
            const cargoPath = path.join(projectPath, 'Cargo.toml');
            if (await fs.pathExists(cargoPath)) {
                console.log(chalk.hex('#ff6b6b')(`  cd ${path.basename(projectPath)}`));
                console.log(chalk.hex('#ff6b6b')('  cargo build'));
            }
            const requirementsPath = path.join(projectPath, 'requirements.txt');
            if (await fs.pathExists(requirementsPath)) {
                console.log(chalk.hex('#9c88ff')(`  cd ${path.basename(projectPath)}`));
                console.log(chalk.hex('#9c88ff')('  pip install -r requirements.txt'));
            }
        }
        catch (error) {
            console.log(chalk.gray('💡 Install dependencies manually:'));
            console.log(chalk.gray(`   cd ${path.basename(projectPath)}`));
            console.log(chalk.gray('   npm install (or pnpm install/yarn)'));
        }
        // Try to initialize git even if dependencies failed
        try {
            await initializeGitRepositoryForCreate(projectPath);
        }
        catch (gitError) {
            console.log(chalk.yellow('⚠️  Could not initialize git repository'));
        }
    }
}
/**
 * Initialize git repository with fallback commands and better error handling
 */
async function initializeGitRepositoryForCreate(projectPath) {
    const gitSpinner = ora(chalk.hex('#00d2d3')('🔧 Initializing git repository...')).start();
    try {
        // Check if git is already initialized
        const gitDir = path.join(projectPath, '.git');
        if (await fs.pathExists(gitDir)) {
            gitSpinner.info(chalk.hex('#95afc0')('Git repository already initialized'));
            return;
        }
        // Try to initialize git repository using MCP server commands first
        try {
            gitSpinner.text = chalk.hex('#00d2d3')('Initializing git with ginit...');
            await execAsync('ginit', { cwd: projectPath });
        }
        catch {
            gitSpinner.text = chalk.hex('#00d2d3')('Initializing git with git init...');
            await execAsync('git init', { cwd: projectPath });
        }
        // Add all files to git
        try {
            gitSpinner.text = chalk.hex('#00d2d3')('Adding files with gadd...');
            await execAsync('gadd', { cwd: projectPath });
        }
        catch {
            gitSpinner.text = chalk.hex('#00d2d3')('Adding files with git add...');
            await execAsync('git add .', { cwd: projectPath });
        }
        // Make initial commit
        try {
            gitSpinner.text = chalk.hex('#00d2d3')('Creating initial commit with gcommit...');
            await execAsync('gcommit "Initial commit from Package Installer CLI v3.0.0"', { cwd: projectPath });
        }
        catch {
            gitSpinner.text = chalk.hex('#00d2d3')('Creating initial commit with git commit...');
            await execAsync('git commit -m "Initial commit from Package Installer CLI v3.0.0"', { cwd: projectPath });
        }
        gitSpinner.succeed(chalk.green('✅ Git repository initialized with initial commit'));
    }
    catch (error) {
        gitSpinner.warn(chalk.yellow('⚠️  Could not initialize git repository automatically'));
        console.log(chalk.hex('#95afc0')('💡 You can initialize git manually:'));
        console.log(chalk.hex('#95afc0')(`   cd ${path.basename(projectPath)}`));
        console.log(chalk.hex('#95afc0')('   git init'));
        console.log(chalk.hex('#95afc0')('   git add .'));
        console.log(chalk.hex('#95afc0')('   git commit -m "Initial commit"'));
    }
}
/**
 * Validate template structure before creation
 */
export async function validateTemplate(templatePath) {
    const issues = [];
    const suggestions = [];
    try {
        // Check if template directory exists
        if (!await fs.pathExists(templatePath)) {
            issues.push('Template directory does not exist');
            return { isValid: false, issues, suggestions };
        }
        // Check if template has content
        const items = await fs.readdir(templatePath);
        if (items.length === 0) {
            issues.push('Template directory is empty');
        }
        // Check for common files
        const packageJsonPath = path.join(templatePath, 'package.json');
        const readmePath = path.join(templatePath, 'README.md');
        const gitignorePath = path.join(templatePath, '.gitignore');
        if (await fs.pathExists(packageJsonPath)) {
            suggestions.push('Template includes package.json - dependencies will be installed');
        }
        if (await fs.pathExists(readmePath)) {
            suggestions.push('Template includes README.md - will be customized for your project');
        }
        if (!await fs.pathExists(gitignorePath)) {
            suggestions.push('Consider adding a .gitignore file to the template');
        }
        // Check for node_modules or other unwanted directories
        const unwantedDirs = ['node_modules', '.git', 'dist', 'build'];
        for (const dir of unwantedDirs) {
            const dirPath = path.join(templatePath, dir);
            if (await fs.pathExists(dirPath)) {
                issues.push(`Template contains unwanted directory: ${dir}`);
            }
        }
        return {
            isValid: issues.length === 0,
            issues,
            suggestions
        };
    }
    catch (error) {
        issues.push(`Error validating template: ${error}`);
        return { isValid: false, issues, suggestions };
    }
}
/**
 * Get template size and file count for caching decisions
 */
export async function getTemplateStats(templatePath) {
    let fileCount = 0;
    let totalSize = 0;
    const directories = [];
    async function scanDirectory(dirPath) {
        try {
            const items = await fs.readdir(dirPath, { withFileTypes: true });
            for (const item of items) {
                const fullPath = path.join(dirPath, item.name);
                if (item.isDirectory()) {
                    // Skip unwanted directories
                    if (!['node_modules', '.git', 'dist', 'build'].includes(item.name)) {
                        directories.push(path.relative(templatePath, fullPath));
                        await scanDirectory(fullPath);
                    }
                }
                else if (item.isFile()) {
                    fileCount++;
                    try {
                        const stats = await fs.stat(fullPath);
                        totalSize += stats.size;
                    }
                    catch (error) {
                        // Skip files that can't be read
                    }
                }
            }
        }
        catch (error) {
            // Skip directories that can't be read
        }
    }
    await scanDirectory(templatePath);
    return {
        fileCount,
        totalSize,
        directories: [...new Set(directories)].sort()
    };
}
