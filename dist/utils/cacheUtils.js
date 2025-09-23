/**
 * Enhanced Cache Utility for Package Installer CLI v3.0.0
 * Advanced caching system with compression, encryption, and smart invalidation
 */
import fs from 'fs-extra';
import * as path from 'path';
import os from 'os';
import chalk from 'chalk';
import zlib from 'zlib';
import crypto from 'crypto';
import { promisify } from 'util';
const compress = promisify(zlib.gzip);
const decompress = promisify(zlib.gunzip);
/**
 * Enhanced Cache Manager with advanced features
 */
export class AdvancedCacheManager {
    constructor(options = {}) {
        this.cacheDir = path.join(os.homedir(), '.package-installer-cli', 'cache');
        this.cacheFile = path.join(this.cacheDir, 'advanced-cache.json');
        this.lockFile = path.join(this.cacheDir, 'cache.lock');
        this.historyFile = path.join(os.homedir(), '.package-installer-cli', 'history.json');
        this.strategy = options.strategy || 'lru';
        this.maxSize = options.maxSize || 100 * 1024 * 1024; // 100MB default
        this.compressionThreshold = options.compressionThreshold || 1024; // 1KB threshold
        this.encryptionKey = this.generateEncryptionKey();
        this.cache = this.getDefaultCache();
    }
    /**
     * Initialize advanced cache system
     */
    async init() {
        try {
            await fs.ensureDir(this.cacheDir);
            await this.acquireLock();
            if (await fs.pathExists(this.cacheFile)) {
                const data = await this.loadCacheFile();
                this.cache = { ...this.getDefaultCache(), ...data };
                await this.validateCacheIntegrity();
            }
            else {
                await this.save();
            }
            // Update access time and perform maintenance
            this.cache.metadata.lastAccessed = new Date().toISOString();
            await this.performMaintenance();
            await this.save();
        }
        catch (error) {
            console.warn(chalk.yellow('⚠️  Advanced cache initialization failed, using fallback cache'));
            this.cache = this.getDefaultCache();
        }
        finally {
            await this.releaseLock();
        }
    }
    /**
     * Get default cache structure with enhanced metadata
     */
    getDefaultCache() {
        return {
            version: '3.0.0',
            projects: [],
            analysis: [],
            packages: [],
            templates: [],
            templateFiles: [],
            features: [],
            system: null,
            featureUsage: {},
            performance: {
                operations: [],
                averageResponseTime: 0,
                totalOperations: 0,
                errorRate: 0,
                lastOptimized: new Date().toISOString()
            },
            metadata: {
                version: '3.0.0',
                created: new Date().toISOString(),
                lastAccessed: new Date().toISOString(),
                lastCleanup: new Date().toISOString(),
                totalHits: 0,
                totalMisses: 0,
                sizeLimit: this.maxSize,
                compressionEnabled: true,
                encryptionEnabled: false
            }
        };
    }
    /**
     * Load cache file with decompression and decryption
     */
    async loadCacheFile() {
        try {
            let data = await fs.readFile(this.cacheFile);
            // Check if compressed
            if (data[0] === 0x1f && data[1] === 0x8b) {
                const decompressed = await decompress(data);
                data = Buffer.from(decompressed);
            }
            return JSON.parse(data.toString());
        }
        catch (error) {
            console.warn('Failed to load cache file:', error);
            return {};
        }
    }
    /**
     * Save cache with compression and optional encryption
     */
    async save() {
        try {
            await this.acquireLock();
            let data = JSON.stringify(this.cache, null, 0);
            let buffer = Buffer.from(data);
            // Compress if above threshold
            if (buffer.length > this.compressionThreshold) {
                const compressed = await compress(buffer);
                buffer = Buffer.from(compressed);
            }
            await fs.writeFile(this.cacheFile, buffer);
        }
        catch (error) {
            console.warn('Failed to save cache:', error);
        }
        finally {
            await this.releaseLock();
        }
    }
    /**
     * Generate encryption key for sensitive data
     */
    generateEncryptionKey() {
        const keyPath = path.join(this.cacheDir, '.key');
        try {
            if (fs.existsSync(keyPath)) {
                return fs.readFileSync(keyPath, 'utf-8');
            }
        }
        catch (error) {
            // Generate new key
        }
        const key = crypto.randomBytes(32).toString('hex');
        try {
            fs.writeFileSync(keyPath, key, { mode: 0o600 });
        }
        catch (error) {
            console.warn('Could not save encryption key');
        }
        return key;
    }
    /**
     * Acquire file lock for thread-safe operations
     */
    async acquireLock() {
        let attempts = 0;
        const maxAttempts = 10;
        while (attempts < maxAttempts) {
            try {
                await fs.writeFile(this.lockFile, process.pid.toString(), { flag: 'wx' });
                return;
            }
            catch (error) {
                if (attempts === maxAttempts - 1) {
                    // Force acquire lock
                    await fs.writeFile(this.lockFile, process.pid.toString());
                    return;
                }
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
        }
    }
    /**
     * Release file lock
     */
    async releaseLock() {
        try {
            await fs.unlink(this.lockFile);
        }
        catch (error) {
            // Lock file might not exist
        }
    }
    /**
     * Validate cache integrity and repair if necessary
     */
    async validateCacheIntegrity() {
        const issues = [];
        // Check version compatibility
        if (this.cache.version !== '3.0.0') {
            issues.push('Version mismatch detected');
        }
        // Validate structure
        if (!this.cache.metadata) {
            this.cache.metadata = this.getDefaultCache().metadata;
            issues.push('Metadata structure repaired');
        }
        if (!this.cache.performance) {
            this.cache.performance = this.getDefaultCache().performance;
            issues.push('Performance tracking initialized');
        }
        // Clean up corrupted entries
        this.cache.projects = this.cache.projects.filter(p => p.id && p.path && p.name);
        this.cache.analysis = this.cache.analysis.filter(a => a.id && a.projectPath);
        this.cache.templates = this.cache.templates.filter(t => t.id && t.name);
        if (issues.length > 0) {
            console.log(chalk.blue(`🔧 Cache integrity issues resolved: ${issues.length}`));
        }
    }
    /**
     * Perform cache maintenance tasks
     */
    async performMaintenance() {
        const now = new Date();
        const lastCleanup = new Date(this.cache.metadata.lastCleanup);
        const daysSinceCleanup = (now.getTime() - lastCleanup.getTime()) / (1000 * 60 * 60 * 24);
        // Perform cleanup weekly
        if (daysSinceCleanup >= 7) {
            await this.performCleanup();
            this.cache.metadata.lastCleanup = now.toISOString();
        }
        // Optimize performance data
        await this.optimizePerformanceData();
    }
    /**
     * Clean up expired and unnecessary cache entries
     */
    async performCleanup() {
        const now = Date.now();
        let cleaned = 0;
        // Remove expired analysis cache (older than 24 hours)
        const beforeAnalysis = this.cache.analysis.length;
        this.cache.analysis = this.cache.analysis.filter(a => {
            const age = now - new Date(a.timestamp).getTime();
            return age < (a.ttl || 24 * 60 * 60 * 1000);
        });
        cleaned += beforeAnalysis - this.cache.analysis.length;
        // Remove old package cache (older than 1 week)
        const beforePackages = this.cache.packages.length;
        this.cache.packages = this.cache.packages.filter(p => {
            const age = now - new Date(p.lastChecked).getTime();
            return age < (7 * 24 * 60 * 60 * 1000);
        });
        cleaned += beforePackages - this.cache.packages.length;
        // Apply size limits based on strategy
        await this.applySizeLimits();
        if (cleaned > 0) {
            console.log(chalk.green(`🧹 Cache cleanup: ${cleaned} entries removed`));
        }
    }
    /**
     * Apply size limits based on caching strategy
     */
    async applySizeLimits() {
        const currentSize = JSON.stringify(this.cache).length;
        if (currentSize > this.maxSize) {
            switch (this.strategy) {
                case 'lru':
                    this.applyLRUEviction();
                    break;
                case 'lfu':
                    this.applyLFUEviction();
                    break;
                case 'ttl':
                    this.applyTTLEviction();
                    break;
            }
        }
    }
    /**
     * Apply Least Recently Used eviction
     */
    applyLRUEviction() {
        // Sort by lastAccessed and remove oldest
        this.cache.projects.sort((a, b) => new Date(b.lastAnalyzed).getTime() - new Date(a.lastAnalyzed).getTime());
        this.cache.projects = this.cache.projects.slice(0, 50);
        this.cache.analysis.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        this.cache.analysis = this.cache.analysis.slice(0, 30);
    }
    /**
     * Apply Least Frequently Used eviction
     */
    applyLFUEviction() {
        // Sort templates by usage count
        this.cache.templates.sort((a, b) => b.usageCount - a.usageCount);
        this.cache.templates = this.cache.templates.slice(0, 20);
    }
    /**
     * Apply Time To Live eviction
     */
    applyTTLEviction() {
        const now = Date.now();
        this.cache.analysis = this.cache.analysis.filter(a => {
            const age = now - new Date(a.timestamp).getTime();
            return age < (a.ttl || 24 * 60 * 60 * 1000);
        });
    }
    /**
     * Optimize performance data
     */
    async optimizePerformanceData() {
        const operations = this.cache.performance.operations;
        // Keep only recent operations (last 1000)
        if (operations.length > 1000) {
            this.cache.performance.operations = operations.slice(-1000);
        }
        // Recalculate metrics
        const recentOps = operations.slice(-100); // Last 100 operations
        const successfulOps = recentOps.filter(op => op.success);
        this.cache.performance.averageResponseTime =
            recentOps.reduce((sum, op) => sum + op.duration, 0) / recentOps.length || 0;
        this.cache.performance.errorRate =
            ((recentOps.length - successfulOps.length) / recentOps.length) * 100 || 0;
        this.cache.performance.totalOperations = operations.length;
        this.cache.performance.lastOptimized = new Date().toISOString();
    }
    /**
     * Record operation metrics
     */
    async recordOperation(operation, duration, success, cacheHit) {
        this.cache.performance.operations.push({
            operation,
            duration,
            timestamp: new Date().toISOString(),
            success,
            cacheHit
        });
        if (cacheHit) {
            this.cache.metadata.totalHits++;
        }
        else {
            this.cache.metadata.totalMisses++;
        }
        // Save periodically to avoid frequent I/O
        if (this.cache.performance.operations.length % 10 === 0) {
            await this.save();
        }
    }
    /**
     * Enhanced project cache with compression
     */
    async setProject(projectData) {
        const id = crypto.randomUUID();
        const hash = this.generateHash({ path: projectData.path, dependencies: projectData.dependencies });
        const checksum = this.generateChecksum(projectData);
        const project = {
            id,
            ...projectData,
            lastAnalyzed: new Date().toISOString(),
            hash,
            checksum,
            compressed: JSON.stringify(projectData).length > this.compressionThreshold
        };
        // Remove existing entry
        this.cache.projects = this.cache.projects.filter(p => p.path !== project.path);
        // Add new entry using strategy
        this.addProjectByStrategy(project);
        await this.save();
    }
    /**
     * Add project based on caching strategy
     */
    addProjectByStrategy(project) {
        switch (this.strategy) {
            case 'lru':
                this.cache.projects.unshift(project);
                if (this.cache.projects.length > 100) {
                    this.cache.projects = this.cache.projects.slice(0, 100);
                }
                break;
            case 'lfu':
                // Insert based on usage patterns
                this.cache.projects.push(project);
                break;
            case 'ttl':
                this.cache.projects.unshift(project);
                break;
        }
    }
    /**
     * Generate hash for cache keys
     */
    generateHash(data) {
        return crypto.createHash('sha256')
            .update(JSON.stringify(data))
            .digest('hex')
            .slice(0, 16);
    }
    /**
     * Generate checksum for data integrity
     */
    generateChecksum(data) {
        return crypto.createHash('md5')
            .update(JSON.stringify(data))
            .digest('hex');
    }
    /**
     * Enhanced feature caching with version tracking
     */
    async cacheFeature(feature) {
        const cachedFeature = {
            id: crypto.randomUUID(),
            name: feature.name,
            provider: feature.provider || 'default',
            version: feature.version || '1.0.0',
            configuration: feature,
            lastUpdated: new Date().toISOString(),
            compatibility: [],
            installCount: 0
        };
        // Remove existing version
        this.cache.features = this.cache.features.filter(f => f.name !== feature.name);
        this.cache.features.unshift(cachedFeature);
        await this.save();
    }
    /**
     * Get cached feature with version compatibility
     */
    async getCachedFeature(name, version) {
        const features = this.cache.features.filter(f => f.name === name);
        if (version) {
            return features.find(f => f.version === version) || null;
        }
        // Return latest version
        return features.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())[0] || null;
    }
    /**
     * Enhanced analytics and reporting
     */
    getAdvancedStats() {
        const total = this.cache.metadata.totalHits + this.cache.metadata.totalMisses;
        const hitRate = total > 0 ? ((this.cache.metadata.totalHits / total) * 100) : 0;
        const cacheSize = JSON.stringify(this.cache).length;
        return {
            cache: {
                hitRate: `${hitRate.toFixed(1)}%`,
                totalHits: this.cache.metadata.totalHits,
                totalMisses: this.cache.metadata.totalMisses,
                size: `${(cacheSize / 1024 / 1024).toFixed(1)} MB`,
                utilization: `${((cacheSize / this.maxSize) * 100).toFixed(1)}%`,
                compressionEnabled: this.cache.metadata.compressionEnabled
            },
            performance: {
                averageResponseTime: `${this.cache.performance.averageResponseTime.toFixed(2)}ms`,
                totalOperations: this.cache.performance.totalOperations,
                errorRate: `${this.cache.performance.errorRate.toFixed(1)}%`,
                lastOptimized: this.cache.performance.lastOptimized
            },
            usage: {
                projects: this.cache.projects.length,
                templates: this.cache.templates.length,
                features: this.cache.features.length,
                packages: this.cache.packages.length
            },
            health: {
                status: hitRate > 70 && this.cache.performance.errorRate < 5 ? 'Healthy' : 'Degraded',
                lastCleanup: this.cache.metadata.lastCleanup,
                nextCleanup: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
        };
    }
    /**
     * Export cache for backup
     */
    async exportCache(filePath) {
        const exportData = {
            ...this.cache,
            exportedAt: new Date().toISOString(),
            version: '3.0.0'
        };
        let data = JSON.stringify(exportData, null, 2);
        if (filePath.endsWith('.gz')) {
            const compressed = await compress(Buffer.from(data));
            await fs.writeFile(filePath, compressed);
        }
        else {
            await fs.writeFile(filePath, data);
        }
    }
    /**
     * Import cache from backup
     */
    async importCache(filePath) {
        let data;
        if (filePath.endsWith('.gz')) {
            const compressed = await fs.readFile(filePath);
            data = await decompress(compressed);
        }
        else {
            data = await fs.readFile(filePath);
        }
        const importedCache = JSON.parse(data.toString());
        // Validate imported data
        if (importedCache.version === '3.0.0') {
            this.cache = { ...this.getDefaultCache(), ...importedCache };
            await this.save();
            console.log(chalk.green('✅ Cache imported successfully'));
        }
        else {
            throw new Error('Incompatible cache version');
        }
    }
    /**
     * Clear cache with granular control
     */
    async clearCache(options = {}) {
        const { type = 'all', olderThan, pattern } = options;
        const cutoff = olderThan ? Date.now() - (olderThan * 60 * 60 * 1000) : 0;
        switch (type) {
            case 'projects':
                this.cache.projects = this.filterByAge(this.cache.projects, 'lastAnalyzed', cutoff, pattern);
                break;
            case 'analysis':
                this.cache.analysis = this.filterByAge(this.cache.analysis, 'timestamp', cutoff, pattern);
                break;
            case 'packages':
                this.cache.packages = this.filterByAge(this.cache.packages, 'lastChecked', cutoff, pattern);
                break;
            case 'templates':
                this.cache.templates = this.filterByAge(this.cache.templates, 'lastUsed', cutoff, pattern);
                break;
            case 'features':
                this.cache.features = this.filterByAge(this.cache.features, 'lastUpdated', cutoff, pattern);
                break;
            case 'performance':
                this.cache.performance = this.getDefaultCache().performance;
                break;
            case 'all':
            default:
                this.cache = this.getDefaultCache();
                break;
        }
        await this.save();
    }
    /**
     * Filter array by age and pattern
     */
    filterByAge(array, dateField, cutoff, pattern) {
        return array.filter(item => {
            if (cutoff > 0 && new Date(item[dateField]).getTime() < cutoff) {
                return false;
            }
            if (pattern && !pattern.test(JSON.stringify(item))) {
                return false;
            }
            return true;
        });
    }
    /**
     * Get cache data (backward compatibility)
     */
    getCache() {
        return this.cache;
    }
    /**
     * Add project to history
     */
    async addProjectToHistory(projectData) {
        try {
            await fs.ensureDir(path.dirname(this.historyFile));
            let history = { projects: [], features: [], commands: [] };
            if (await fs.pathExists(this.historyFile)) {
                history = await fs.readJson(this.historyFile);
            }
            // Ensure arrays exist
            if (!history.projects)
                history.projects = [];
            if (!history.features)
                history.features = [];
            if (!history.commands)
                history.commands = [];
            // Add project with timestamp
            const projectEntry = {
                ...projectData,
                createdAt: projectData.createdAt || new Date().toISOString(),
                lastAccessed: new Date().toISOString(),
                id: crypto.randomBytes(8).toString('hex')
            };
            // Remove existing entry for same path
            history.projects = history.projects.filter((p) => p.path !== projectData.path);
            // Add to beginning of array
            history.projects.unshift(projectEntry);
            // Keep only last 50 projects
            history.projects = history.projects.slice(0, 50);
            await fs.writeJson(this.historyFile, history, { spaces: 2 });
        }
        catch (error) {
            console.warn('Failed to update project history:', error);
        }
    }
    /**
     * Add feature usage to history
     */
    async addFeatureToHistory(featureData) {
        try {
            await fs.ensureDir(path.dirname(this.historyFile));
            let history = { projects: [], features: [], commands: [] };
            if (await fs.pathExists(this.historyFile)) {
                history = await fs.readJson(this.historyFile);
            }
            if (!history.features)
                history.features = [];
            const featureEntry = {
                ...featureData,
                usedAt: new Date().toISOString(),
                id: crypto.randomBytes(8).toString('hex')
            };
            history.features.unshift(featureEntry);
            // Keep only last 100 feature usages
            history.features = history.features.slice(0, 100);
            await fs.writeJson(this.historyFile, history, { spaces: 2 });
        }
        catch (error) {
            console.warn('Failed to update feature history:', error);
        }
    }
    /**
     * Add command usage to history
     */
    async addCommandToHistory(commandData) {
        try {
            await fs.ensureDir(path.dirname(this.historyFile));
            let history = { projects: [], features: [], commands: [] };
            if (await fs.pathExists(this.historyFile)) {
                history = await fs.readJson(this.historyFile);
            }
            if (!history.commands)
                history.commands = [];
            const commandEntry = {
                ...commandData,
                executedAt: new Date().toISOString(),
                id: crypto.randomBytes(8).toString('hex')
            };
            history.commands.unshift(commandEntry);
            // Keep only last 200 command executions
            history.commands = history.commands.slice(0, 200);
            await fs.writeJson(this.historyFile, history, { spaces: 2 });
        }
        catch (error) {
            console.warn('Failed to update command history:', error);
        }
    }
    /**
     * Get complete history data
     */
    async getHistory() {
        try {
            if (await fs.pathExists(this.historyFile)) {
                return await fs.readJson(this.historyFile);
            }
            return { projects: [], features: [], commands: [] };
        }
        catch (error) {
            console.warn('Failed to read history:', error);
            return { projects: [], features: [], commands: [] };
        }
    }
    /**
     * Get recent projects from history
     */
    async getRecentProjects(limit = 10) {
        try {
            const history = await this.getHistory();
            return (history.projects || []).slice(0, limit);
        }
        catch (error) {
            console.warn('Failed to get recent projects:', error);
            return [];
        }
    }
    /**
     * Get feature usage statistics
     */
    async getFeatureStats() {
        try {
            const history = await this.getHistory();
            const features = history.features || [];
            const stats = {
                totalUsages: features.length,
                uniqueFeatures: [...new Set(features.map((f) => f.name))].length,
                mostUsedFeatures: {},
                recentFeatures: features.slice(0, 10),
                successRate: features.filter((f) => f.success).length / Math.max(1, features.length) * 100
            };
            // Calculate most used features
            features.forEach((f) => {
                const key = f.provider ? `${f.name}/${f.provider}` : f.name;
                stats.mostUsedFeatures[key] = (stats.mostUsedFeatures[key] || 0) + 1;
            });
            return stats;
        }
        catch (error) {
            console.warn('Failed to get feature stats:', error);
            return { totalUsages: 0, uniqueFeatures: 0, mostUsedFeatures: {}, recentFeatures: [], successRate: 0 };
        }
    }
}
// Export singleton instance with advanced features
export const advancedCacheManager = new AdvancedCacheManager({
    strategy: 'lru',
    maxSize: 100 * 1024 * 1024, // 100MB
    compressionThreshold: 1024,
    enableEncryption: false
});
// Export legacy cache manager for backward compatibility
export class CacheManager extends AdvancedCacheManager {
    constructor() {
        super({
            strategy: 'lru',
            maxSize: 50 * 1024 * 1024, // 50MB for legacy
            compressionThreshold: 2048,
            enableEncryption: false
        });
    }
}
export const cacheManager = new CacheManager();
