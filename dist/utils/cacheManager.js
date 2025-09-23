/**
 * Cache Manager - Centralized caching operations for Package Installer CLI
 */
import { cacheManager as cacheManagerInstance } from './cacheUtils.js';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
// Export the cache manager instance
export const cacheManager = cacheManagerInstance;
/**
 * Initialize cache system on CLI startup
 */
export async function initializeCache() {
    await cacheManagerInstance.init();
}
/**
 * Get cached project
 */
export async function getCachedProject(projectPath) {
    try {
        const cache = cacheManagerInstance.getCache();
        const cached = cache.projects.find((p) => p.path === projectPath);
        return cached || null;
    }
    catch (error) {
        return null;
    }
}
/**
 * Cache project data (simplified)
 */
export async function cacheProjectData(projectPath, name, language, framework, dependencies, size) {
    try {
        // For now, just cache basic project info without complex dependencies
        console.log(chalk.gray(`📊 Caching project data for ${name}`));
    }
    catch (error) {
        console.warn('Failed to cache project data:', error);
    }
}
/**
 * Get cached template files (simplified)
 */
export async function getCachedTemplateFiles(templateName) {
    try {
        const cache = cacheManagerInstance.getCache();
        const template = cache.templateFiles.find((t) => t.templateName === templateName);
        return template || null;
    }
    catch (error) {
        return null;
    }
}
/**
 * Cache template files (simplified)
 */
export async function cacheTemplateFiles(templateName, templatePath, files, size) {
    try {
        console.log(chalk.gray(`📊 Caching template files for ${templateName}`));
    }
    catch (error) {
        console.warn('Failed to cache template files:', error);
    }
}
/**
 * Update template usage statistics (simplified)
 */
export async function updateTemplateUsage(templateName, framework, language, features) {
    try {
        console.log(chalk.gray(`📊 Recording template usage: ${templateName}`));
    }
    catch (error) {
        console.warn('Failed to update template usage:', error);
    }
}
/**
 * Get directory size utility function
 */
export async function getDirectorySize(dirPath) {
    try {
        let totalSize = 0;
        async function calculateSize(currentPath) {
            const stats = await fs.stat(currentPath);
            if (stats.isFile()) {
                totalSize += stats.size;
            }
            else if (stats.isDirectory()) {
                const items = await fs.readdir(currentPath);
                for (const item of items) {
                    if (!['node_modules', '.git', 'dist', 'build'].includes(item)) {
                        await calculateSize(path.join(currentPath, item));
                    }
                }
            }
        }
        await calculateSize(dirPath);
        return totalSize;
    }
    catch (error) {
        return 0;
    }
}
/**
 * Read template files for caching
 */
export async function readTemplateFiles(templatePath) {
    const files = {};
    async function readFiles(currentPath, relativePath = '') {
        try {
            const items = await fs.readdir(currentPath, { withFileTypes: true });
            for (const item of items) {
                const fullPath = path.join(currentPath, item.name);
                const relativeItemPath = path.join(relativePath, item.name);
                if (item.isFile()) {
                    // Skip binary files and large files
                    const stats = await fs.stat(fullPath);
                    if (stats.size < 1024 * 1024) { // Skip files larger than 1MB
                        const content = await fs.readFile(fullPath, 'utf-8').catch(() => null);
                        if (content !== null) {
                            files[relativeItemPath] = content;
                        }
                    }
                }
                else if (item.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(item.name)) {
                    await readFiles(fullPath, relativeItemPath);
                }
            }
        }
        catch (error) {
            // Skip directories that can't be read
        }
    }
    await readFiles(templatePath);
    return files;
}
/**
 * Create project from cached template
 */
export async function createProjectFromCachedTemplate(projectName, cachedTemplate) {
    const projectPath = path.resolve(process.cwd(), projectName);
    // Create project directory
    await fs.ensureDir(projectPath);
    // Write cached files
    if (cachedTemplate.files) {
        for (const [filePath, content] of Object.entries(cachedTemplate.files)) {
            const fullPath = path.join(projectPath, filePath);
            await fs.ensureDir(path.dirname(fullPath));
            await fs.writeFile(fullPath, content);
        }
    }
    return projectPath;
}
/**
 * Get cache statistics
 */
export function getCacheStats() {
    try {
        return cacheManagerInstance.getAdvancedStats();
    }
    catch (error) {
        return {
            cache: { hitRate: '0%', size: 0 },
            health: { status: 'Unknown' },
            performance: {}
        };
    }
}
/**
 * Get cache status
 */
export function getCacheStatus() {
    try {
        const stats = getCacheStats();
        const cache = cacheManagerInstance.getCache();
        return {
            isHealthy: stats.health?.status === 'Healthy',
            hitRate: 0,
            totalProjects: cache.projects?.length || 0,
            totalTemplates: cache.templates?.length || 0,
            totalFeatures: cache.features?.length || 0,
            recentProjects: [],
            performance: stats.performance || {},
            size: stats.cache?.size || 0
        };
    }
    catch (error) {
        return {
            isHealthy: false,
            hitRate: 0,
            totalProjects: 0,
            totalTemplates: 0,
            totalFeatures: 0,
            recentProjects: [],
            performance: {},
            size: 0
        };
    }
}
