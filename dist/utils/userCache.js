/**
 * User Cache - Stores user preferences and choices for faster CLI experience
 */
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
export class UserCacheManager {
    constructor() {
        this.cacheDir = path.join(os.homedir(), '.package-installer-cli');
        this.cacheFile = path.join(this.cacheDir, 'user-preferences.json');
        this.cache = this.getDefaultCache();
    }
    /**
     * Initialize user cache
     */
    async init() {
        try {
            await fs.ensureDir(this.cacheDir);
            if (await fs.pathExists(this.cacheFile)) {
                const data = await fs.readJson(this.cacheFile);
                this.cache = { ...this.getDefaultCache(), ...data };
            }
            await this.save();
        }
        catch (error) {
            console.warn(chalk.yellow('⚠️  User cache initialization failed, using defaults'));
            this.cache = this.getDefaultCache();
        }
    }
    /**
     * Get default cache structure
     */
    getDefaultCache() {
        return {
            version: '3.0.0',
            lastUpdated: new Date().toISOString(),
            preferences: {
                skipDisclaimer: false,
                autoInstallDependencies: true,
                defaultPackageManager: 'npm',
                preferredTemplateStructure: undefined,
                preferredStyleSolution: undefined
            },
            recentChoices: {
                frameworks: [],
                languages: [],
                uiLibraries: [],
                bundlers: []
            },
            projectSuggestions: {
                lastGenerated: '',
                suggestions: []
            }
        };
    }
    /**
     * Get user cache data
     */
    getCache() {
        return this.cache;
    }
    /**
     * Update user choices
     */
    async updateChoices(choices) {
        // Update last used values
        if (choices.framework) {
            this.cache.framework = choices.framework;
            this.addToRecent('frameworks', choices.framework);
        }
        if (choices.language) {
            this.cache.language = choices.language;
            this.addToRecent('languages', choices.language);
        }
        if (choices.bundler) {
            this.cache.bundler = choices.bundler;
            this.addToRecent('bundlers', choices.bundler);
        }
        if (choices.ui) {
            this.cache.ui = choices.ui;
            this.addToRecent('uiLibraries', choices.ui);
        }
        if (choices.useSrc !== undefined) {
            this.cache.useSrc = choices.useSrc;
            this.cache.preferences.preferredTemplateStructure = choices.useSrc ? 'src' : 'no-src';
        }
        if (choices.useTailwind !== undefined) {
            this.cache.useTailwind = choices.useTailwind;
            this.cache.preferences.preferredStyleSolution = choices.useTailwind ? 'tailwind' : 'none';
        }
        await this.save();
    }
    /**
     * Update user preferences
     */
    async updatePreferences(preferences) {
        this.cache.preferences = { ...this.cache.preferences, ...preferences };
        await this.save();
    }
    /**
     * Add item to recent choices list
     */
    addToRecent(type, item) {
        const list = this.cache.recentChoices[type];
        // Remove if already exists
        const index = list.indexOf(item);
        if (index > -1) {
            list.splice(index, 1);
        }
        // Add to beginning
        list.unshift(item);
        // Keep only top 5
        if (list.length > 5) {
            list.splice(5);
        }
    }
    /**
     * Generate project name suggestions
     */
    async generateProjectSuggestions(framework) {
        const now = new Date();
        const lastGenerated = new Date(this.cache.projectSuggestions.lastGenerated);
        const oneHour = 60 * 60 * 1000;
        // Return cached suggestions if less than 1 hour old
        if ((now.getTime() - lastGenerated.getTime()) < oneHour && this.cache.projectSuggestions.suggestions.length > 0) {
            return this.cache.projectSuggestions.suggestions;
        }
        // Generate new suggestions
        const baseNames = [
            'awesome', 'cool', 'super', 'amazing', 'modern', 'new', 'my', 'epic',
            'smart', 'quick', 'fast', 'secure', 'clean', 'simple', 'elegant'
        ];
        const frameworkNames = framework ? [framework] : ['app', 'project', 'site', 'web', 'dashboard'];
        const suffixes = ['app', 'project', 'tool', 'kit', 'hub', 'studio', 'lab'];
        const suggestions = [];
        // Generate combinations
        for (const base of baseNames.slice(0, 5)) {
            for (const fw of frameworkNames.slice(0, 2)) {
                suggestions.push(`${base}-${fw}`);
                suggestions.push(`${base}-${fw}-${suffixes[Math.floor(Math.random() * suffixes.length)]}`);
            }
        }
        // Add some timestamped options
        const timestamp = now.getFullYear().toString().slice(-2) + (now.getMonth() + 1).toString().padStart(2, '0');
        suggestions.push(`project-${timestamp}`);
        suggestions.push(`${framework || 'app'}-${timestamp}`);
        // Shuffle and take top 10
        const shuffled = suggestions.sort(() => Math.random() - 0.5).slice(0, 10);
        // Cache the suggestions
        this.cache.projectSuggestions = {
            lastGenerated: now.toISOString(),
            suggestions: shuffled
        };
        await this.save();
        return shuffled;
    }
    /**
     * Clear user cache
     */
    async clearCache() {
        this.cache = this.getDefaultCache();
        await this.save();
    }
    /**
     * Display cached preferences
     */
    displayCache() {
        console.log('\n' + chalk.hex('#00d2d3')('🎯 Your Preferences:'));
        console.log(chalk.hex('#95afc0')('─'.repeat(40)));
        if (this.cache.framework) {
            console.log(chalk.hex('#667eea')(`Preferred Framework: ${this.cache.framework}`));
        }
        if (this.cache.language) {
            console.log(chalk.hex('#667eea')(`Preferred Language: ${this.cache.language}`));
        }
        if (this.cache.bundler) {
            console.log(chalk.hex('#667eea')(`Preferred Bundler: ${this.cache.bundler}`));
        }
        if (this.cache.ui) {
            console.log(chalk.hex('#667eea')(`Preferred UI: ${this.cache.ui}`));
        }
        if (this.cache.useSrc !== undefined) {
            console.log(chalk.hex('#667eea')(`Src Directory: ${this.cache.useSrc ? 'Yes' : 'No'}`));
        }
        if (this.cache.useTailwind !== undefined) {
            console.log(chalk.hex('#667eea')(`Tailwind CSS: ${this.cache.useTailwind ? 'Yes' : 'No'}`));
        }
        // Display preferences
        if (this.cache.preferences.defaultPackageManager) {
            console.log(chalk.hex('#667eea')(`Package Manager: ${this.cache.preferences.defaultPackageManager}`));
        }
        if (this.cache.preferences.autoInstallDependencies !== undefined) {
            console.log(chalk.hex('#667eea')(`Auto Install Dependencies: ${this.cache.preferences.autoInstallDependencies ? 'Yes' : 'No'}`));
        }
        // Display recent choices
        console.log('\n' + chalk.hex('#00d2d3')('📋 Recent Choices:'));
        if (this.cache.recentChoices.frameworks.length > 0) {
            console.log(chalk.hex('#95afc0')(`Frameworks: ${this.cache.recentChoices.frameworks.join(', ')}`));
        }
        if (this.cache.recentChoices.languages.length > 0) {
            console.log(chalk.hex('#95afc0')(`Languages: ${this.cache.recentChoices.languages.join(', ')}`));
        }
        if (this.cache.recentChoices.uiLibraries.length > 0) {
            console.log(chalk.hex('#95afc0')(`UI Libraries: ${this.cache.recentChoices.uiLibraries.join(', ')}`));
        }
        if (this.cache.recentChoices.bundlers.length > 0) {
            console.log(chalk.hex('#95afc0')(`Bundlers: ${this.cache.recentChoices.bundlers.join(', ')}`));
        }
    }
    /**
     * Save cache to file
     */
    async save() {
        this.cache.lastUpdated = new Date().toISOString();
        await fs.writeJson(this.cacheFile, this.cache, { spaces: 2 });
    }
}
// Export singleton instance and utility functions
export const userCacheManager = new UserCacheManager();
// Legacy function exports for compatibility
export async function loadUserCache() {
    await userCacheManager.init();
    return userCacheManager.getCache();
}
export async function saveUserCache(cache) {
    await userCacheManager.updateChoices(cache);
}
export function getCacheDefault(key, defaultValue) {
    const cache = userCacheManager.getCache();
    return cache[key] !== undefined ? cache[key] : defaultValue;
}
export async function clearUserCache() {
    await userCacheManager.clearCache();
}
export function showUserCache() {
    userCacheManager.displayCache();
}
export async function generateProjectNameSuggestions(framework) {
    return await userCacheManager.generateProjectSuggestions(framework);
}
