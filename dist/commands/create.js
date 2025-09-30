/**
 * Create command - Creates a new project from templates with comprehensive prompts
 */
import chalk from 'chalk';
import path from 'path';
import { createStandardHelp } from '../utils/helpFormatter.js';
import { promptProjectName, promptFrameworkSelection, promptLanguageSelection, promptTemplateSelection, promptFrameworkOptions, promptTemplateConfirmation, promptFeatureSelection, hasFrameworkOptions, hasUIOptions, hasBundlerOptions, shouldShowTemplates } from '../utils/prompts.js';
import { resolveTemplatePath, generateTemplateName, templateExists, getFrameworkConfig } from '../utils/templateResolver.js';
import { createProjectFromTemplate, installDependenciesForCreate } from '../utils/templateCreator.js';
import { updateTemplateUsage, getCachedTemplateFiles, cacheTemplateFiles, cacheProjectData } from '../utils/cacheManager.js';
import { CacheManager } from '../utils/cacheUtils.js';
/**
 * Display help for create command
 */
export function showCreateHelp() {
    const helpConfig = {
        commandName: 'Create',
        emoji: '🚀',
        description: 'Create a new project from our curated collection of modern templates.\nChoose from React, Next.js, Express, Nest.js, Rust, and more!',
        usage: [
            'create [project-name] [options]',
            'create [options]'
        ],
        options: [
            { flag: '-h, --help', description: 'Display help for this command' },
            { flag: '--show-cache', description: 'Show cached preferences' },
            { flag: '--clear-cache', description: 'Clear cached preferences' }
        ],
        examples: [
            { command: 'create my-awesome-app', description: 'Create with specific name' },
            { command: 'create', description: 'Interactive mode - will prompt for name' },
            { command: 'create --show-cache', description: 'Show cached preferences' },
            { command: 'create --clear-cache', description: 'Clear cached preferences' }
        ],
        additionalSections: [
            {
                title: 'Smart Caching',
                items: [
                    'Remembers your preferences from previous sessions',
                    'Suggests framework-specific project names',
                    'Shows project count and usage statistics'
                ]
            },
            {
                title: 'Available Templates',
                items: [
                    'React (Vite) - JavaScript/TypeScript variants',
                    'Next.js - App Router with multiple configurations',
                    'Express - RESTful APIs with authentication',
                    'Nest.js - Enterprise-grade Node.js framework',
                    'Angular - Modern Angular applications',
                    'Vue.js - Progressive Vue.js applications',
                    'Rust - Systems programming templates',
                    'Django - Python web framework',
                    'Flask - Lightweight Python web apps',
                    'Go - Fast and efficient web services',
                    'React-Native - Mobile apps for iOS and Android',
                    'Combination Templates - reactjs+express+shadcn,reactjs=nestjs+shadcn'
                ]
            }
        ],
        tips: [
            'Use interactive mode for guided project creation',
            'Templates include best practices and modern tooling',
            'All templates support both JavaScript and TypeScript'
        ]
    };
    createStandardHelp(helpConfig);
}
/**
 * Main create project function with comprehensive prompt system
 */
export async function createProject(providedName, options) {
    const startTime = Date.now();
    const cacheManager = new CacheManager();
    // Check for special flags
    if (providedName === '--help' || providedName === '-h' || options?.help || options?.['--help'] || options?.['-h']) {
        showCreateHelp();
        return;
    }
    try {
        console.log('\n' + chalk.hex('#10ac84')('🚀 Welcome to Package Installer CLI!'));
        console.log(chalk.hex('#95afc0')('Let\'s create something amazing together...'));
        // Step 1: Get project name (prompt if not provided)
        let projectName = providedName ? providedName.trim() : '';
        if (!projectName) {
            projectName = await promptProjectName();
            if (projectName === '.') {
                projectName = path.basename(process.cwd());
                console.log(chalk.cyan(`\n✅ Using current directory name: ${chalk.bold(projectName)}`));
            }
            else {
                console.log(chalk.cyan(`\n✅ Using project name: ${chalk.bold(projectName)}`));
            }
        }
        else if (projectName === '.') {
            projectName = path.basename(process.cwd());
            console.log(chalk.cyan(`\n✅ Using current directory name: ${chalk.bold(projectName)}`));
        }
        // Step 2: Framework selection
        const selectedFramework = await promptFrameworkSelection();
        console.log(`\n${chalk.green('✨ Great choice!')} Let's configure your ${chalk.bold(selectedFramework)} project...`);
        // Step 3: Language selection (framework-specific from template.json)
        const selectedLanguage = await promptLanguageSelection(selectedFramework);
        // Step 4: Framework-specific options (UI, Tailwind, bundlers, etc.)
        let options = {};
        if (hasFrameworkOptions(selectedFramework) || hasUIOptions(selectedFramework) || hasBundlerOptions(selectedFramework)) {
            options = await promptFrameworkOptions(selectedFramework);
        }
        // Step 5: Template selection and generation
        let templateName = '';
        if (shouldShowTemplates(selectedFramework)) {
            // For frameworks WITHOUT options - show template selection list
            templateName = await promptTemplateSelection(selectedFramework);
        }
        else if (hasFrameworkOptions(selectedFramework) || hasUIOptions(selectedFramework) || hasBundlerOptions(selectedFramework)) {
            // For frameworks WITH options - generate template name from user choices
            templateName = generateTemplateName(selectedFramework, options);
            if (!templateName) {
                console.log(chalk.yellow(`⚠️  Could not generate template name for ${selectedFramework}`));
                // Fallback to first available template
                const config = getFrameworkConfig(selectedFramework);
                if (config?.templates && config.templates.length > 0) {
                    templateName = config.templates[0];
                }
            }
        }
        // Step 6: Confirmation before creating project
        const confirmed = await promptTemplateConfirmation(selectedFramework, selectedLanguage, templateName, options);
        if (!confirmed) {
            console.log(chalk.yellow('\n❌ Project creation cancelled.'));
            return;
        }
        // Step 7: Prepare project info
        const projectInfo = {
            framework: selectedFramework,
            language: selectedLanguage,
            templateName,
            options
        };
        // Step 8: Resolve template path
        const templatePath = resolveTemplatePath(projectInfo);
        console.log(chalk.hex('#00d2d3')(`\n🔨 Creating your project...\n`));
        console.log(chalk.blue(`📁 Using template: ${templatePath}`));
        // Step 9: Check if template exists
        if (!templateExists(templatePath)) {
            console.log(chalk.red(`❌ Template not found at: ${templatePath}`));
            console.log(chalk.yellow('📋 Please check your template configuration'));
            return;
        }
        // Step 10: Create project from template
        const projectPath = await createProjectFromTemplate({
            projectName,
            framework: selectedFramework,
            language: selectedLanguage,
            templateName,
            templatePath,
            options
        });
        // Step 11: Install dependencies
        await installDependenciesForCreate(projectPath);
        // Step 11.5: Cache template usage and project data
        try {
            await updateTemplateUsage(templateName || selectedFramework, selectedFramework, selectedLanguage);
            const templateFiles = await getCachedTemplateFiles(templateName || selectedFramework);
            await cacheTemplateFiles(templateName || selectedFramework, templatePath, templateFiles || {});
            await cacheProjectData(projectPath, projectName, selectedLanguage);
        }
        catch (error) {
            console.warn(chalk.yellow('⚠️  Could not cache project data'));
        }
        // Step 12: Add features if requested
        const selectedFeatures = await promptFeatureSelection();
        if (selectedFeatures.length > 0) {
            console.log(chalk.hex('#00d2d3')('\n🚀 Adding Features...\n'));
            // Import the add command dynamically to avoid circular imports
            const { addCommand } = await import('./add.js');
            for (const category of selectedFeatures) {
                try {
                    console.log(chalk.cyan(`🔧 Adding ${category} feature...`));
                    // Use the add command directly with the detected framework
                    await addCommand(category, undefined, {
                        framework: selectedFramework,
                        projectPath: projectPath,
                        list: false,
                        verbose: false
                    });
                    console.log(chalk.green(`✅ Successfully added ${category} feature`));
                }
                catch (error) {
                    console.log(chalk.yellow(`⚠️  Failed to add ${category} feature, skipping...`));
                }
            }
        }
        // Step 13: Update cache and history
        await cacheManager.addProjectToHistory({
            name: projectName,
            path: projectPath,
            framework: selectedFramework,
            language: selectedLanguage,
            features: selectedFeatures,
            createdAt: new Date().toISOString()
        });
        // Track command completion
        const duration = Date.now() - startTime;
        await cacheManager.addCommandToHistory({
            command: 'create',
            args: [projectName, selectedFramework, selectedLanguage],
            projectPath: projectPath,
            success: true,
            duration
        });
        // Success message
        console.log(chalk.hex('#00d2d3')('\n🎉 Project created successfully!\n'));
        console.log(chalk.white('📦 Project Details:'));
        console.log(`   ${chalk.gray('Path:')} ${chalk.cyan(projectPath)}`);
        console.log(`   ${chalk.gray('Framework:')} ${chalk.green(selectedFramework)}`);
        console.log(`   ${chalk.gray('Language:')} ${chalk.blue(selectedLanguage)}`);
        if (templateName) {
            console.log(`   ${chalk.gray('Template:')} ${chalk.yellow(templateName)}`);
        }
        if (selectedFeatures.length > 0) {
            console.log(`   ${chalk.gray('Features:')} ${chalk.magenta(selectedFeatures.join(', '))}`);
        }
        console.log(`\n${chalk.hex('#95afc0')('Navigate to your project:')} ${chalk.bold(providedName === '.' ? 'Already in project directory!' : `cd ${projectName}`)}`);
    }
    catch (error) {
        // Track command failure
        const duration = Date.now() - startTime;
        await cacheManager.addCommandToHistory({
            command: 'create',
            args: providedName ? [providedName] : [],
            projectPath: process.cwd(),
            success: false,
            duration
        });
        console.log(chalk.red('\n❌ Error creating project:'));
        console.log(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
    }
}
