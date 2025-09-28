/**
 * Template path resolution utilities for Package Installer CLI v3.2.0
 * Handles template name generation and path resolution based on template.json
 */
import path from 'path';
import fs from 'fs-extra';
import { getCliRootPath, getTemplatesPath } from './pathResolver.js';
// Helper functions to read template.json
function getTemplateConfig() {
    const cliDir = getCliRootPath();
    const templatePath = path.join(cliDir, 'template.json');
    if (!fs.existsSync(templatePath)) {
        throw new Error(`template.json not found at: ${templatePath}`);
    }
    return JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
}
function getFrameworkConfig(framework) {
    const config = getTemplateConfig();
    return config.frameworks[framework];
}
// Export for use in other modules
export { getFrameworkConfig };
/**
 * Generate template name based on framework options - use exact template names from template.json
 * Only generates for frameworks that HAVE options
 */
export function generateTemplateName(framework, options) {
    const config = getFrameworkConfig(framework);
    // Only generate template names for frameworks that have options
    if (!config?.options && !config?.ui && !config?.bundlers) {
        return '';
    }
    // If framework has predefined templates, select the matching one based on options
    if (config.templates && config.templates.length > 0) {
        // Build template name based on selected options
        const parts = [];
        // Handle src option (only for nextjs and reactjs)
        if ((framework === 'nextjs' || framework === 'reactjs') && config.options?.includes('src')) {
            if (options.src) {
                parts.push('src');
            }
            else {
                parts.push('no-src');
            }
        }
        // Handle UI library - only add if actually selected (not "none")
        // When UI is "none", templates simply omit the UI part from their names
        if (config.ui && config.ui.length > 0) {
            if (options.ui && options.ui !== 'none') {
                parts.push(options.ui);
            }
            // For "none" selection, don't add any UI part to the template name
        }
        // Handle tailwind option
        if (config.options?.includes('tailwind')) {
            if (options.tailwind) {
                parts.push('tailwind');
            }
            else {
                parts.push('no-tailwind');
            }
        }
        const generatedName = parts.join('-') + '-template';
        // Find exact match in templates array
        const exactMatch = config.templates.find((template) => template === generatedName);
        if (exactMatch) {
            return exactMatch;
        }
        // If no exact match, return the first template as fallback
        return config.templates[0];
    }
    return '';
}
/**
 * Resolve template directory path based on framework and template name
 */
export function resolveTemplatePath(projectInfo) {
    const { framework, language, templateName } = projectInfo;
    const templatesRoot = getTemplatesPath();
    // Handle combination templates (like reactjs+expressjs+shadcn)
    if (framework.includes('+')) {
        const frameworkDir = framework.replace(/\+/g, '-');
        const combinationPath = path.join(templatesRoot, frameworkDir);
        if (fs.existsSync(combinationPath)) {
            // Check for language subdirectory
            if (language) {
                const langPath = path.join(combinationPath, language);
                if (fs.existsSync(langPath)) {
                    // Check for specific template
                    if (templateName) {
                        const templatePath = path.join(langPath, templateName);
                        if (fs.existsSync(templatePath)) {
                            return templatePath;
                        }
                    }
                    return langPath;
                }
            }
            return combinationPath;
        }
    }
    // For frameworks with specific template names
    if (templateName) {
        // Check if language subdirectory exists and is required
        const languageSubdirPath = path.join(templatesRoot, framework, language || 'typescript');
        if (fs.existsSync(languageSubdirPath)) {
            const templatePath = path.join(languageSubdirPath, templateName);
            if (fs.existsSync(templatePath)) {
                return templatePath;
            }
        }
        // Otherwise, use direct framework directory with template name
        const directTemplatePath = path.join(templatesRoot, framework, templateName);
        if (fs.existsSync(directTemplatePath)) {
            return directTemplatePath;
        }
    }
    // For frameworks with options but no specific template name, use language subdirectory if available
    if (language) {
        const languageSubdirPath = path.join(templatesRoot, framework, language);
        if (fs.existsSync(languageSubdirPath)) {
            return languageSubdirPath;
        }
    }
    // Default: use the framework directory directly
    return path.join(templatesRoot, framework);
}
/**
 * Check if template directory exists
 */
export function templateExists(templatePath) {
    return fs.existsSync(templatePath) && fs.statSync(templatePath).isDirectory();
}
/**
 * Get all available templates for a framework
 */
export function getFrameworkTemplates(framework) {
    const templatesRoot = getTemplatesPath();
    const frameworkPath = path.join(templatesRoot, framework);
    if (!fs.existsSync(frameworkPath)) {
        return [];
    }
    return fs.readdirSync(frameworkPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}
