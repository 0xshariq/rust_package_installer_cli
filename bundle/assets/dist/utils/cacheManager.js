/**
 * Cache Manager - Centralized caching operations for Package Installer CLI
 * Simplified version focusing on essential caching functionality only
 */
import { cacheManager as cacheManagerInstance } from './cacheUtils.js';
import fs from 'fs-extra';
import path from 'path';
// Export the cache manager instance
export const cacheManager = cacheManagerInstance;
/**
 * Initialize cache system on CLI startup
 */
export async function initializeCache() {
    try {
        await cacheManagerInstance.init();
    }
    catch (error) {
        // Silent fail - cache will work in memory mode
    }
}
/**
 * Get cached template files (simplified - returns null for now)
 */
export async function getCachedTemplateFiles(templateName) {
    // Simplified implementation - just return null for now
    return null;
}
/**
 * Cache template files (simplified - no-op for now)
 */
export async function cacheTemplateFiles(templateName, templatePath, files) {
    // Simplified implementation - no-op for now
    // This reduces complexity and memory usage
}
/**
 * Update template usage statistics (simplified - no-op for now)
 */
export async function updateTemplateUsage(templateName, framework, language) {
    // Simplified implementation - no-op for now
    // This reduces complexity and memory usage
}
/**
 * Cache project data (simplified - no-op for now)
 */
export async function cacheProjectData(projectPath, name, type) {
    // Simplified implementation - no-op for now
    // This reduces complexity and memory usage
}
/**
 * Get directory size utility function
 */
export async function getDirectorySize(dirPath) {
    try {
        let totalSize = 0;
        async function calculateSize(currentPath) {
            try {
                const stats = await fs.stat(currentPath);
                if (stats.isFile()) {
                    totalSize += stats.size;
                }
                else if (stats.isDirectory()) {
                    const items = await fs.readdir(currentPath);
                    for (const item of items) {
                        // Skip large directories to avoid performance issues
                        if (!['node_modules', '.git', 'dist', 'build', 'target', '.cache'].includes(item)) {
                            await calculateSize(path.join(currentPath, item));
                        }
                    }
                }
            }
            catch (error) {
                // Skip files/directories that can't be accessed
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
 * Get cache statistics (simplified)
 */
export function getCacheStats() {
    try {
        const cache = cacheManagerInstance.getCache();
        return {
            projects: cache.projects || [],
            templates: cache.templates || [],
            templateFiles: cache.templateFiles || [],
            features: cache.features || [],
            hits: 0,
            misses: 0
        };
    }
    catch (error) {
        return {
            projects: [],
            templates: [],
            templateFiles: [],
            features: [],
            hits: 0,
            misses: 0
        };
    }
}
/**
 * Get cache status (simplified)
 */
export function getCacheStatus() {
    try {
        const cache = cacheManagerInstance.getCache();
        return {
            initialized: true,
            version: cache.version || '1.0.0',
            totalProjects: cache.projects?.length || 0,
            totalTemplates: cache.templates?.length || 0,
            totalFeatures: cache.features?.length || 0
        };
    }
    catch (error) {
        return {
            initialized: false,
            version: '1.0.0',
            totalProjects: 0,
            totalTemplates: 0,
            totalFeatures: 0
        };
    }
}
