/**
 * History Manager - Track CLI usage and store frameworks/features in hidden CLI folder
 */
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import crypto from 'crypto';
export class HistoryManager {
    constructor() {
        // Use the same hidden folder as other cache files
        this.cliDir = path.join(os.homedir(), '.package-installer-cli');
        this.historyFile = path.join(this.cliDir, 'history.json');
        this.frameworksFile = path.join(this.cliDir, 'frameworks.json');
        this.featuresFile = path.join(this.cliDir, 'features-usage.json');
        this.history = this.getDefaultHistory();
    }
    /**
     * Initialize history system
     */
    async init() {
        try {
            await fs.ensureDir(this.cliDir);
            if (await fs.pathExists(this.historyFile)) {
                const data = await fs.readJson(this.historyFile);
                this.history = { ...this.getDefaultHistory(), ...data };
            }
            else {
                await this.save();
            }
            // Update last used timestamp
            this.history.statistics.lastUsed = new Date().toISOString();
            await this.save();
            // Initialize separate framework and feature files
            await this.initializeFrameworksFile();
            await this.initializeFeaturesFile();
        }
        catch (error) {
            console.warn(chalk.yellow('⚠️  History initialization failed, using memory history'));
            this.history = this.getDefaultHistory();
        }
    }
    /**
     * Initialize frameworks tracking file
     */
    async initializeFrameworksFile() {
        if (!await fs.pathExists(this.frameworksFile)) {
            const frameworks = {
                lastUpdated: new Date().toISOString(),
                frameworks: this.history.statistics.frameworkUsage
            };
            await fs.writeJson(this.frameworksFile, frameworks, { spaces: 2 });
        }
    }
    /**
     * Initialize features tracking file
     */
    async initializeFeaturesFile() {
        if (!await fs.pathExists(this.featuresFile)) {
            const features = {
                lastUpdated: new Date().toISOString(),
                features: this.history.statistics.featureUsage
            };
            await fs.writeJson(this.featuresFile, features, { spaces: 2 });
        }
    }
    /**
     * Get default history structure
     */
    getDefaultHistory() {
        return {
            version: '3.0.0',
            lastUpdated: new Date().toISOString(),
            projects: [],
            features: [],
            commands: [],
            statistics: {
                totalProjects: 0,
                totalFeatures: 0,
                totalCommands: 0,
                frameworkUsage: {},
                featureUsage: {},
                mostUsedFramework: '',
                mostUsedFeature: '',
                lastUsed: new Date().toISOString(),
                totalUsageTime: 0
            }
        };
    }
    /**
     * Record a new project creation
     */
    async recordProject(project) {
        const id = this.generateId();
        const now = new Date().toISOString();
        const projectEntry = {
            id,
            name: project.name,
            path: project.path,
            framework: project.framework,
            language: project.language,
            template: project.template,
            features: project.features || [],
            createdAt: now,
            lastModified: now,
            size: 0,
            dependencies: []
        };
        this.history.projects.unshift(projectEntry);
        // Update statistics
        this.history.statistics.totalProjects++;
        this.updateFrameworkUsage(project.framework, project.language, project.template);
        await this.save();
        await this.saveFrameworksFile();
    }
    /**
     * Record a feature addition
     */
    async recordFeature(feature) {
        const id = this.generateId();
        const now = new Date().toISOString();
        const featureEntry = {
            id,
            name: feature.name,
            projectPath: feature.projectPath,
            projectName: feature.projectName,
            framework: feature.framework,
            provider: feature.provider,
            addedAt: now,
            success: feature.success !== false
        };
        this.history.features.unshift(featureEntry);
        // Update project to include the feature
        const project = this.history.projects.find(p => p.path === feature.projectPath);
        if (project && !project.features.includes(feature.name)) {
            project.features.push(feature.name);
            project.lastModified = now;
        }
        // Update statistics
        this.history.statistics.totalFeatures++;
        this.updateFeatureUsage(feature.name, feature.framework, feature.provider);
        await this.save();
        await this.saveFeaturesFile();
    }
    /**
     * Record a command execution
     */
    async recordCommand(command) {
        const id = this.generateId();
        const now = new Date().toISOString();
        const commandEntry = {
            id,
            command: command.command,
            args: command.args,
            executedAt: now,
            success: command.success,
            executionTime: command.executionTime,
            workingDirectory: process.cwd()
        };
        this.history.commands.unshift(commandEntry);
        // Keep only last 100 commands
        if (this.history.commands.length > 100) {
            this.history.commands = this.history.commands.slice(0, 100);
        }
        // Update statistics
        this.history.statistics.totalCommands++;
        this.history.statistics.totalUsageTime += command.executionTime;
        await this.save();
    }
    /**
     * Update framework usage statistics
     */
    updateFrameworkUsage(framework, language, template) {
        if (!this.history.statistics.frameworkUsage[framework]) {
            this.history.statistics.frameworkUsage[framework] = {
                count: 0,
                lastUsed: new Date().toISOString(),
                languages: {},
                templates: {}
            };
        }
        const fw = this.history.statistics.frameworkUsage[framework];
        fw.count++;
        fw.lastUsed = new Date().toISOString();
        if (!fw.languages[language]) {
            fw.languages[language] = 0;
        }
        fw.languages[language]++;
        if (template && !fw.templates[template]) {
            fw.templates[template] = 0;
        }
        if (template) {
            fw.templates[template]++;
        }
        // Update most used framework
        const frameworks = Object.entries(this.history.statistics.frameworkUsage);
        const mostUsed = frameworks.reduce((prev, curr) => prev[1].count > curr[1].count ? prev : curr);
        this.history.statistics.mostUsedFramework = mostUsed[0];
    }
    /**
     * Update feature usage statistics
     */
    updateFeatureUsage(feature, framework, provider) {
        if (!this.history.statistics.featureUsage[feature]) {
            this.history.statistics.featureUsage[feature] = {
                count: 0,
                lastUsed: new Date().toISOString(),
                frameworks: {},
                providers: {}
            };
        }
        const feat = this.history.statistics.featureUsage[feature];
        feat.count++;
        feat.lastUsed = new Date().toISOString();
        if (!feat.frameworks[framework]) {
            feat.frameworks[framework] = 0;
        }
        feat.frameworks[framework]++;
        if (provider) {
            if (!feat.providers[provider]) {
                feat.providers[provider] = 0;
            }
            feat.providers[provider]++;
        }
        // Update most used feature
        const features = Object.entries(this.history.statistics.featureUsage);
        if (features.length > 0) {
            const mostUsed = features.reduce((prev, curr) => prev[1].count > curr[1].count ? prev : curr);
            this.history.statistics.mostUsedFeature = mostUsed[0];
        }
    }
    /**
     * Save frameworks data to separate file
     */
    async saveFrameworksFile() {
        const frameworks = {
            lastUpdated: new Date().toISOString(),
            frameworks: this.history.statistics.frameworkUsage
        };
        await fs.writeJson(this.frameworksFile, frameworks, { spaces: 2 });
    }
    /**
     * Save features data to separate file
     */
    async saveFeaturesFile() {
        const features = {
            lastUpdated: new Date().toISOString(),
            features: this.history.statistics.featureUsage
        };
        await fs.writeJson(this.featuresFile, features, { spaces: 2 });
    }
    /**
     * Get recent projects
     */
    getRecentProjects(limit = 10) {
        return this.history.projects
            .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
            .slice(0, limit);
    }
    /**
     * Get recent features
     */
    getRecentFeatures(limit = 10) {
        return this.history.features
            .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
            .slice(0, limit);
    }
    /**
     * Get framework usage statistics
     */
    getFrameworkStats() {
        return Object.entries(this.history.statistics.frameworkUsage)
            .map(([framework, data]) => ({
            framework,
            count: data.count,
            languages: Object.keys(data.languages),
            lastUsed: data.lastUsed
        }))
            .sort((a, b) => b.count - a.count);
    }
    /**
     * Get feature usage statistics
     */
    getFeatureStats() {
        return Object.entries(this.history.statistics.featureUsage)
            .map(([feature, data]) => ({
            feature,
            count: data.count,
            frameworks: Object.keys(data.frameworks),
            lastUsed: data.lastUsed
        }))
            .sort((a, b) => b.count - a.count);
    }
    /**
     * Get command usage statistics
     */
    getCommandStats() {
        const commandCounts = {};
        this.history.commands.forEach(cmd => {
            if (!commandCounts[cmd.command]) {
                commandCounts[cmd.command] = { count: 0, lastUsed: cmd.executedAt };
            }
            commandCounts[cmd.command].count++;
            if (new Date(cmd.executedAt) > new Date(commandCounts[cmd.command].lastUsed)) {
                commandCounts[cmd.command].lastUsed = cmd.executedAt;
            }
        });
        return Object.entries(commandCounts)
            .map(([command, data]) => ({
            command,
            count: data.count,
            lastUsed: data.lastUsed
        }))
            .sort((a, b) => b.count - a.count);
    }
    /**
     * Get complete history
     */
    getHistory() {
        return this.history;
    }
    /**
     * Save history to file
     */
    async save() {
        this.history.lastUpdated = new Date().toISOString();
        await fs.writeJson(this.historyFile, this.history, { spaces: 2 });
    }
    /**
     * Generate unique ID
     */
    generateId() {
        return crypto.randomBytes(8).toString('hex');
    }
    /**
     * Clear history (with backup)
     */
    async clearHistory() {
        // Create backup
        const backupFile = path.join(this.cliDir, `history-backup-${Date.now()}.json`);
        if (await fs.pathExists(this.historyFile)) {
            await fs.copy(this.historyFile, backupFile);
        }
        // Reset history
        this.history = this.getDefaultHistory();
        await this.save();
        // Clear separate files
        await fs.remove(this.frameworksFile);
        await fs.remove(this.featuresFile);
        await this.initializeFrameworksFile();
        await this.initializeFeaturesFile();
    }
    /**
     * Export history data
     */
    async exportHistory(outputPath) {
        const exportData = {
            exportedAt: new Date().toISOString(),
            version: this.history.version,
            history: this.history,
            frameworks: await this.loadFrameworksFile(),
            features: await this.loadFeaturesFile()
        };
        await fs.writeJson(outputPath, exportData, { spaces: 2 });
    }
    /**
     * Load frameworks data
     */
    async loadFrameworksFile() {
        try {
            if (await fs.pathExists(this.frameworksFile)) {
                return await fs.readJson(this.frameworksFile);
            }
        }
        catch (error) {
            console.warn('Could not load frameworks file');
        }
        return { frameworks: {} };
    }
    /**
     * Load features data
     */
    async loadFeaturesFile() {
        try {
            if (await fs.pathExists(this.featuresFile)) {
                return await fs.readJson(this.featuresFile);
            }
        }
        catch (error) {
            console.warn('Could not load features file');
        }
        return { features: {} };
    }
    /**
     * Add clone history entry
     */
    async addCloneHistory(entry) {
        try {
            await this.init();
            // Create unique ID for the clone entry
            const id = crypto.randomBytes(8).toString('hex');
            // Add to history with ID
            const historyEntry = {
                id,
                ...entry
            };
            this.history.cloneHistory = this.history.cloneHistory || [];
            this.history.cloneHistory.unshift(historyEntry);
            // Keep only last 50 clone entries
            if (this.history.cloneHistory.length > 50) {
                this.history.cloneHistory = this.history.cloneHistory.slice(0, 50);
            }
            // Update statistics
            if (entry.success) {
                this.history.statistics.totalProjects++;
            }
            // Save to file
            await this.save();
        }
        catch (error) {
            console.error(chalk.red('Failed to add clone history:'), error.message);
        }
    }
    /**
     * Get clone history
     */
    async getCloneHistory() {
        try {
            await this.init();
            return this.history.cloneHistory || [];
        }
        catch (error) {
            console.error('Failed to get clone history');
            return [];
        }
    }
    /**
     * Get recent clone history (last 10)
     */
    async getRecentClones() {
        const history = await this.getCloneHistory();
        return history.slice(0, 10);
    }
}
// Export singleton instance
export const historyManager = new HistoryManager();
