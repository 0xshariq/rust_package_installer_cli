# 📚 Package Installer CLI - Commands Documentation

This document provides comprehensive information about all available commands in Package Installer CLI.

## 🚀 Quick Start

### Installation

Install Package Installer CLI globally using your preferred package manager:

```bash
# Using npm
npm install -g @0xshariq/package-installer

# Using pnpm (recommended)
pnpm install -g @0xshariq/package-installer

# Using yarn
yarn global add @0xshariq/package-installer
```

After installation, you can use the `pi` command globally in any terminal.

### First Steps

```bash
# Check installation
pi --version

# Get help
pi --help

# Create your first project
pi create my-awesome-app

# Analyze any existing project
cd existing-project && pi analyze
```

## 🌐 Global Options

Available for all commands:

| Option | Short | Description | Example |
|--------|-------|-------------|---------|
| `--version` | `-v` | Display CLI version | `pi -v` |
| `--help` | `-h` | Show help information | `pi -h` |
| `--verbose` | | Enable detailed logging | `pi create --verbose` |
| `--no-cache` | | Disable caching for command | `pi analyze --no-cache` |

## 📋 Commands Overview

| Command | Purpose | Real-time Data | Status |
|---------|---------|----------------|--------|
| [`create`](#create-command) | Create new projects from templates | ✅ Live template selection | ✅ Available |
| [`analyze`](#analyze-command) | Project analytics dashboard | ✅ Real usage data | ✅ Available |
| [`update`](#update-command) | Update project dependencies | ✅ Live version checks | ✅ Available |
| [`add`](#add-command) | Add features to existing projects | ✅ Feature detection | ✅ Available |
| [`check`](#check-command) | Project health diagnostics | ✅ Real-time checks | ✅ Available |
| [`clone`](#clone-command) | Clone and setup repositories | ✅ Git integration | ✅ Available |
| [`doctor`](#doctor-command) | Diagnose and fix issues | ✅ System analysis | ✅ Available |
| [`env`](#env-command) | Environment analysis | ✅ Live environment | ✅ Available |
| [`clean`](#clean-command) | Clean project artifacts | ✅ Real file scanning | ✅ Available |
| [`cache`](#cache-command) | Manage CLI cache and data | ✅ Real cache stats | ✅ Available |
| [`upgrade-cli`](#upgrade-cli-command) | Upgrade CLI version | ✅ Version checking | ✅ Available |
| [`deploy`](#deploy-command) | Deploy to cloud platforms | 🚧 In Development | 🚧 Coming Soon |


## 🛠️ Core Commands

### `create` Command

Create new projects from pre-configured templates with interactive setup and modern tooling.

**Syntax:**
```bash
pi create [project-name] [options]
```

**Interactive Mode:**
```bash
# Start interactive project creation
pi create

# Follow the prompts:
# 1. Select framework (React, Next.js, Vue, Angular, etc.)
# 2. Choose language (TypeScript/JavaScript)
# 3. Pick styling options (Tailwind, Material-UI, etc.)
# 4. Configure additional features
# 5. Set project name and location
```

**Direct Mode:**
```bash
# Create with specific name
pi create my-awesome-app

# Create in specific directory
pi create ./projects/my-app

# Create with template preselection (Coming Soon)
pi create my-app --template=nextjs-ts-tailwind
```

**Available Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--template` | Pre-select template | `--template=react-vite-ts` |
| `--no-install` | Skip dependency installation | `--no-install` |
| `--no-git` | Skip git initialization | `--no-git` |
| `--package-manager` | Force package manager | `--package-manager=pnpm` |

**Template Categories:**
- **Frontend Frameworks:** React, Next.js, Vue.js, Angular, Svelte
- **Backend APIs:** Express.js, NestJS, FastAPI, Django
- **Fullstack Solutions:** React+Express, React+NestJS with shadcn/ui
- **System Programming:** Rust (basic & advanced), Go, Python
- **Mobile Development:** React Native (coming soon)

**Project Structure Example:**
```
my-awesome-app/
├── src/
│   ├── components/       # Reusable components
│   ├── pages/           # Application pages
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── styles/          # Styling files
├── public/              # Static assets
├── package.json         # Dependencies & scripts
├── tsconfig.json        # TypeScript config
├── tailwind.config.js   # Tailwind CSS config
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation
```

**Features:**
- ✅ **Smart Template Selection** - AI-powered recommendations
- ✅ **Modern Tooling** - Vite, TypeScript, ESLint, Prettier
- ✅ **Package Manager Detection** - Auto-detects npm/yarn/pnpm
- ✅ **Git Integration** - Automatic repository initialization
- ✅ **User Preferences** - Remembers your choices for faster setup

---

### `analyze` Command

Comprehensive project analytics with real-time data and performance insights.

**Syntax:**
```bash
pi analyze [options]
```

**Basic Usage:**
```bash
# Analyze current directory
pi analyze

# Analyze specific project
pi analyze /path/to/project

# Force refresh without cache
pi analyze --no-cache
```

**Dashboard Features:**

**📊 Project Overview:**
- Language/framework detection
- Project size and file count
- Dependency analysis with versions
- Git repository information

**📈 Analytics Dashboard:**
```
Package Installer CLI Analytics
===============================

📊 Usage Statistics
├── Total Projects Created: 15
├── Most Used Template: React (40%)
├── Preferred Language: TypeScript (80%)
└── Success Rate: 98.5%

⚡ Performance Insights
├── Average Setup Time: 2.3 minutes
├── Cache Hit Rate: 85%
├── Template Load Time: 0.8 seconds
└── Dependency Install Time: 45 seconds

🛠️ Environment Info
├── OS: Linux x64
├── Node.js: v20.10.0
├── Package Manager: pnpm 8.15.0
└── Git: 2.41.0
```

**Available Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--format` | Output format (table/json) | `--format=json` |
| `--detailed` | Show detailed analysis | `--detailed` |
| `--export` | Export analysis to file | `--export=analysis.json` |

**Real-time Data Sources:**
- ✅ **Live Project Scanning** - Current directory analysis
- ✅ **Package Version Checking** - Latest version comparisons
- ✅ **Git Status Integration** - Repository health checks
- ✅ **Usage History** - Data from `~/.package-installer-cli/history.json`

---

### `update` Command

Update project dependencies across multiple languages and package managers.

**Syntax:**
```bash
pi update [package-names...] [options]
```

**Interactive Mode:**
```bash
# Interactive update menu
pi update

# Select packages to update:
# ├── 📦 React: 18.2.0 → 18.3.1 (Minor)
# ├── 📦 TypeScript: 5.1.6 → 5.3.2 (Minor)
# ├── 📦 Next.js: 13.4.19 → 14.0.0 (Major) ⚠️
# └── 📦 Tailwind: 3.3.3 → 3.4.0 (Minor)
```

**Targeted Updates:**
```bash
# Update specific packages
pi update lodash react typescript

# Update development dependencies
pi update --dev eslint prettier

# Update global packages
pi update --global typescript nodemon
```

**Supported Languages & Package Managers:**

| Language | Package Manager | Auto-Detection | Example |
|----------|----------------|----------------|---------|
| **JavaScript/TypeScript** | npm, yarn, pnpm | ✅ Lock files | `pi update react lodash` |
| **Rust** | cargo | ✅ Cargo.toml | `pi update serde tokio` |
| **Python** | pip, poetry | ✅ requirements.txt | `pi update requests flask` |
| **Go** | go modules | ✅ go.mod | `pi update github.com/gin-gonic/gin` |
| **PHP** | composer | ✅ composer.json | `pi update symfony/console` |
| **Ruby** | bundler | ✅ Gemfile | `pi update rails puma` |

**Available Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--all` | Update all packages | `--all` |
| `--dev` | Update only dev dependencies | `--dev` |
| `--global` | Update global packages | `--global` |
| `--dry-run` | Preview changes only | `--dry-run` |
| `--force` | Force update (skip confirmation) | `--force` |

**Update Process:**
1. **Detection Phase** - Scan for package managers and dependency files
2. **Analysis Phase** - Check current vs latest versions
3. **Selection Phase** - Interactive package selection or auto-selection
4. **Update Phase** - Execute package manager commands
5. **Verification Phase** - Confirm successful updates

**Safety Features:**
- ✅ **Backup Creation** - Automatic package.json backup
- ✅ **Version Conflict Detection** - Warns about breaking changes
- ✅ **Rollback Support** - Easy revert if issues occur
- ✅ **Dependency Validation** - Checks for compatibility issues

---

### `add` Command

Add features and integrations to existing projects with smart configuration.

**Syntax:**
```bash
pi add [feature-name] [options]
```

**Interactive Mode:**
```bash
# Browse available features
pi add

# Category-based selection:
# 🔐 Authentication
# ├── Auth0 Integration
# ├── Clerk Authentication
# ├── NextAuth.js Setup
# └── Custom JWT Auth
#
# 🎨 UI Libraries
# ├── Tailwind CSS
# ├── Material-UI
# ├── Chakra UI
# └── shadcn/ui
```

**Direct Feature Addition:**
```bash
# Add specific features
pi add auth            # Authentication setup
pi add docker          # Docker configuration
pi add tailwind        # Tailwind CSS integration
pi add testing         # Testing framework setup
pi add database        # Database integration
```

**Feature Categories:**

**🔐 Authentication:**
- Auth0, Clerk, NextAuth.js, Firebase Auth
- JWT implementation, OAuth providers
- Session management, user roles

**🎨 UI & Styling:**
- Tailwind CSS, Material-UI, Chakra UI, shadcn/ui
- Theme configuration, responsive design
- Icon libraries, animation frameworks

**🗄️ Database Integration:**
- MongoDB, PostgreSQL, MySQL, Redis
- ORM setup (Prisma, TypeORM, Mongoose)
- Migration scripts, seed data

**📊 Analytics & Monitoring:**
- Google Analytics, Plausible, PostHog
- Error tracking (Sentry), performance monitoring
- Custom event tracking, user behavior analysis

**🐳 DevOps & Deployment:**
- Docker containerization, CI/CD pipelines
- Kubernetes manifests, environment configuration
- Health checks, logging setup

**Available Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--config` | Custom configuration | `--config=advanced` |
| `--skip-install` | Skip dependency installation | `--skip-install` |
| `--overwrite` | Overwrite existing files | `--overwrite` |

**Smart Configuration:**
- ✅ **Framework Detection** - Adapts to your project type
- ✅ **Existing Config Merging** - Preserves current settings
- ✅ **Dependency Conflict Resolution** - Handles version conflicts
- ✅ **Environment Setup** - Creates necessary config files

---

### `check` Command

Comprehensive project health diagnostics and dependency validation.

**Syntax:**
```bash
pi check [package-name] [options]
```

**Project Health Check:**
```bash
# Complete project analysis
pi check

# Health Report:
# ✅ Dependencies: All up to date
# ⚠️  Security: 2 vulnerabilities found
# ❌ Performance: Bundle size too large
# ✅ Code Quality: ESLint passing
# ⚠️  Git: Uncommitted changes
```

**Specific Package Check:**
```bash
# Check individual packages
pi check react
pi check @types/node
pi check eslint

# Output:
# 📦 react
# ├── Current: 18.2.0
# ├── Latest: 18.3.1
# ├── Status: Outdated (Minor update available)
# ├── Security: No known vulnerabilities
# └── Size: 42.2kB (gzipped)
```

**Health Check Categories:**

**📦 Dependencies:**
- Version compatibility analysis
- Security vulnerability scanning
- Unused dependency detection
- License compliance checking

**⚡ Performance:**
- Bundle size analysis
- Load time optimization suggestions
- Memory usage patterns
- Build time metrics

**🔍 Code Quality:**
- ESLint/TSLint rule violations
- Code complexity analysis
- Test coverage reports
- Documentation completeness

**🔒 Security:**
- Known vulnerability database checks
- Package signature verification
- Dependency tree analysis
- Security best practice validation

**Available Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--security` | Security-focused scan | `--security` |
| `--performance` | Performance analysis | `--performance` |
| `--detailed` | Detailed diagnostics | `--detailed` |
| `--fix` | Auto-fix issues | `--fix` |

---

### `clone` Command

Clone and setup repositories with intelligent configuration detection.

**Syntax:**
```bash
pi clone [repository-url] [directory] [options]
```

**Interactive Repository Discovery:**
```bash
# Browse popular repositories
pi clone

# Repository categories:
# 🚀 Trending Projects
# 📚 Learning Resources
# 🛠️ Development Tools
# 🎨 UI Components
# 📱 Mobile Apps
```

**Direct Repository Cloning:**
```bash
# Clone from GitHub
pi clone facebook/react
pi clone vercel/next.js my-nextjs-study

# Clone from GitLab
pi clone gitlab:group/project

# Clone from custom Git URLs
pi clone https://github.com/user/repo.git
pi clone git@github.com:user/repo.git
```

**Smart Setup Features:**

**📦 Dependency Detection:**
- Automatic package manager detection
- Smart dependency installation
- Development environment setup
- Build script configuration

**🔧 Configuration Setup:**
- Environment variable templates
- Database connection setup
- API key placeholders
- Development server configuration

**📋 Project Analysis:**
- Technology stack detection
- Framework version identification
- Required tool installation prompts
- Setup instruction generation

**Available Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--no-install` | Skip dependency installation | `--no-install` |
| `--branch` | Clone specific branch | `--branch=develop` |
| `--depth` | Shallow clone depth | `--depth=1` |
| `--setup` | Run automated setup | `--setup` |

**Post-Clone Actions:**
1. **Dependency Installation** - Automatic npm/yarn/pnpm install
2. **Environment Setup** - Copy .env.example to .env
3. **Database Setup** - Migration and seed data (if applicable)
4. **Development Server** - Instructions for starting the project
5. **Documentation** - Open README and setup guides

---

### `doctor` Command

Advanced diagnostics and automated issue resolution for development environments.

**Syntax:**
```bash
pi doctor [options]
```

**Comprehensive System Check:**
```bash
# Full system diagnostics
pi doctor

# Diagnostic Report:
# 🏥 Package Installer CLI Doctor
# ================================
#
# ✅ System Environment
# ├── OS: Linux x64 ✓
# ├── Node.js: v20.10.0 ✓
# ├── Package Managers: npm ✓, pnpm ✓, yarn ✓
# └── Git: 2.41.0 ✓
#
# ⚠️  Project Issues
# ├── Outdated dependencies: 5 packages
# ├── Security vulnerabilities: 2 moderate
# ├── Large bundle size: 2.3MB (recommended: <1MB)
# └── Missing TypeScript types: @types/lodash
#
# 🔧 Suggested Fixes
# ├── Run: pi update --security
# ├── Install: npm i @types/lodash
# └── Optimize: Enable tree shaking
```

**Diagnostic Categories:**

**🖥️ System Environment:**
- Operating system compatibility
- Node.js version and installation
- Package manager availability and versions
- Git configuration and SSH keys
- Required development tools

**📦 Project Health:**
- Dependency version conflicts
- Missing peer dependencies
- Unused dependencies
- Security vulnerabilities
- License compatibility

**⚙️ Configuration Issues:**
- TypeScript configuration errors
- ESLint and Prettier conflicts
- Build configuration problems
- Environment variable issues
- Port conflicts and accessibility

**🚀 Performance Problems:**
- Large bundle sizes
- Slow build times
- Memory usage issues
- Inefficient dependency usage
- Missing optimizations

**Available Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--fix` | Automatically fix issues | `--fix` |
| `--system` | System-only diagnostics | `--system` |
| `--project` | Project-only diagnostics | `--project` |
| `--verbose` | Detailed diagnostic output | `--verbose` |

**Auto-Fix Capabilities:**
- ✅ **Dependency Updates** - Update outdated packages
- ✅ **Security Patches** - Apply security fixes
- ✅ **Configuration Repairs** - Fix common config issues
- ✅ **Performance Optimizations** - Apply best practices
- ✅ **Code Style Fixes** - Format and lint corrections

---

### `env` Command

Comprehensive development environment analysis and optimization recommendations.

**Syntax:**
```bash
pi env [options]
```

**Environment Overview:**
```bash
# Analyze development environment
pi env

# Environment Report:
# 🌍 Development Environment Analysis
# ===================================
#
# 💻 System Information
# ├── OS: Ubuntu 22.04 LTS (Linux x64)
# ├── CPU: Intel Core i7-10700K (16 cores)
# ├── Memory: 32GB (Available: 28GB)
# ├── Disk: 512GB SSD (Free: 128GB)
# └── Shell: bash 5.1.16
#
# 🛠️ Development Tools
# ├── Node.js: v20.10.0 (✅ Latest LTS)
# ├── npm: 10.2.3 (✅ Up to date)
# ├── pnpm: 8.15.0 (✅ Latest)
# ├── yarn: 4.0.2 (✅ Latest)
# ├── Git: 2.41.0 (✅ Latest)
# ├── Docker: 24.0.7 (✅ Latest)
# └── VS Code: 1.85.0 (✅ Latest)
#
# 🔧 Package Installer CLI
# ├── Version: 2.1.0 (✅ Latest)
# ├── Cache Size: 45MB
# ├── Projects Created: 15
# └── Last Update Check: 2 hours ago
```

**Performance Recommendations:**
```bash
# Get optimization suggestions
pi env --optimize

# Optimization Suggestions:
# ⚡ Performance Improvements
# ├── Enable pnpm for 3x faster installs
# ├── Configure npm registry mirror for faster downloads
# ├── Increase Node.js memory limit: --max-old-space-size=8192
# ├── Enable disk cache for Docker builds
# └── Configure Git LFS for large file handling
#
# 🔒 Security Enhancements
# ├── Enable npm audit auto-fix
# ├── Configure GitHub SSH key authentication
# ├── Set up GPG commit signing
# └── Enable 2FA for package manager accounts
```

**Tool Version Management:**
```bash
# Check for tool updates
pi env --check-updates

# Update recommendations:
# 📦 Available Updates
# ├── Node.js: 20.10.0 → 21.4.0 (Consider for testing)
# ├── Docker: 24.0.7 → 24.0.8 (Security update)
# └── VS Code: 1.85.0 → 1.85.1 (Bug fixes)
```

**Available Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--optimize` | Show optimization suggestions | `--optimize` |
| `--check-updates` | Check for tool updates | `--check-updates` |
| `--export` | Export environment info | `--export=env.json` |
| `--benchmark` | Run performance benchmarks | `--benchmark` |

---

### `clean` Command

Intelligent project cleanup with selective file removal and optimization.

**Syntax:**
```bash
pi clean [target] [options]
```

**Interactive Cleanup:**
```bash
# Interactive cleanup menu
pi clean

# Cleanup Options:
# 🧹 Project Cleanup
# ├── 📦 Dependencies (node_modules): 450MB
# ├── 🏗️ Build artifacts (dist, build): 23MB
# ├── 📊 Log files (*.log): 5MB
# ├── 🗂️ Cache directories (.cache): 78MB
# ├── 🎯 Temporary files (*.tmp): 2MB
# └── 🔍 Analysis reports: 1MB
#
# Total space to recover: 559MB
# Select items to clean: [Space to select, Enter to confirm]
```

**Targeted Cleanup:**
```bash
# Clean specific targets
pi clean deps           # Remove node_modules, vendor, etc.
pi clean build          # Remove build artifacts
pi clean cache          # Clear all cache directories
pi clean logs           # Remove log files
pi clean temp           # Remove temporary files
```

**Cleanup Targets:**

**📦 Dependencies:**
- `node_modules/` (Node.js)
- `vendor/` (PHP, Ruby)
- `target/` (Rust)
- `__pycache__/` (Python)
- `build/` directories

**🏗️ Build Artifacts:**
- `dist/`, `build/`, `out/`
- `*.js.map`, `*.css.map`
- Compiled binaries
- Generated documentation
- Bundle analysis files

**🗂️ Cache Directories:**
- `.cache/`, `.tmp/`
- Package manager caches
- Build tool caches
- Browser caches
- Test coverage reports

**📊 Development Files:**
- Log files (`*.log`)
- Debug files (`*.debug`)
- Profiling data
- Test reports
- Benchmark results

**Available Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--dry-run` | Preview cleanup without removing | `--dry-run` |
| `--force` | Skip confirmation prompts | `--force` |
| `--recursive` | Clean subdirectories | `--recursive` |
| `--preserve` | Preserve specific patterns | `--preserve="*.config.js"` |

**Safety Features:**
- ✅ **Preview Mode** - See what will be deleted before confirmation
- ✅ **Selective Cleaning** - Choose specific file types
- ✅ **Size Calculation** - Shows space that will be recovered
- ✅ **Backup Option** - Create backup before major cleanups
- ✅ **Exclude Patterns** - Protect important files

---

### `cache` Command

Advanced cache management with detailed analytics and optimization tools.

**Syntax:**
```bash
pi cache [subcommand] [options]
```

**Cache Dashboard:**
```bash
# View comprehensive cache information
pi cache

# Package Installer CLI Cache Dashboard
# ====================================
#
# 📊 Cache Statistics
# ├── Total Size: 127MB
# ├── Files Count: 1,247
# ├── Hit Rate: 87.3%
# ├── Last Cleanup: 3 days ago
# └── Storage Location: ~/.package-installer-cli/
#
# 📂 Cache Breakdown
# ├── 📋 Project Metadata: 45MB (851 files)
# ├── 📦 Package Info: 32MB (234 files)
# ├── 🎨 Template Files: 28MB (89 files)
# ├── 🔍 Analysis Results: 15MB (67 files)
# └── ⚙️ System Cache: 7MB (6 files)
#
# ⏱️ Cache Performance
# ├── Project Analysis: 2.3x faster
# ├── Template Loading: 5.1x faster
# ├── Package Updates: 1.8x faster
# └── Environment Checks: 3.2x faster
```

**Cache Management:**

**📊 Statistics & Analytics:**
```bash
# Detailed cache statistics
pi cache stats

# Performance metrics:
# - Cache hit/miss ratios
# - Speed improvements per operation
# - Storage efficiency analysis
# - Usage patterns over time
```

**🧹 Cache Cleaning:**
```bash
# Clear all caches
pi cache clear all

# Clear specific cache types
pi cache clear projects      # Project metadata
pi cache clear analysis      # Analysis results
pi cache clear packages      # Package version info
pi cache clear templates     # Template files
pi cache clear system        # System environment

# Selective clearing with confirmation
pi cache clear projects --confirm
```

**🔧 Cache Optimization:**
```bash
# Optimize cache performance
pi cache optimize

# Optimization actions:
# ├── Remove expired entries
# ├── Compress old data
# ├── Reorganize file structure
# ├── Update access timestamps
# └── Defragment cache database
```

**📋 Cache Information:**
```bash
# Show cache configuration
pi cache info

# Configuration details:
# ├── Cache Directory: ~/.package-installer-cli/
# ├── Max Size: 500MB
# ├── Auto-cleanup: Enabled
# ├── Compression: Enabled
# └── Encryption: Disabled
```

**Cache Types & Expiry:**

| Cache Type | Expiry | Purpose | Size Impact |
|------------|--------|---------|-------------|
| **Project Analysis** | 2 hours | Faster repeat analysis | High |
| **Package Versions** | 1 hour | Version checking | Medium |
| **Template Files** | 7 days | Template installation | High |
| **System Environment** | 24 hours | Environment detection | Low |
| **Usage Statistics** | Permanent | Analytics & insights | Low |

**Available Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--size` | Show size information | `--size` |
| `--performance` | Show performance metrics | `--performance` |
| `--confirm` | Skip confirmation prompts | `--confirm` |
| `--verbose` | Detailed operation output | `--verbose` |

**Cache Benefits:**
- ⚡ **5-10x faster** project creation with cached templates
- ⚡ **2-3x faster** project analysis with metadata cache
- ⚡ **60% faster** package updates with version cache
- ⚡ **Instant** recommendations with usage pattern cache

---

### `upgrade-cli` Command

Intelligent CLI upgrade system with breaking change detection and automatic migration.

**Syntax:**
```bash
pi upgrade-cli [options]
```

**Smart Upgrade Process:**
```bash
# Upgrade to latest version
pi upgrade-cli

# Upgrade Process:
# 🔍 Checking for updates...
# ├── Current Version: 2.0.5
# ├── Latest Version: 2.1.0
# ├── Release Type: Minor Update
# └── Breaking Changes: None detected
#
# 📋 What's New in v2.1.0:
# ├── ✨ Enhanced analytics dashboard
# ├── 🚀 Faster template loading (3x speed)
# ├── 🔧 Improved error handling
# ├── 📦 New React Native templates
# └── 🐛 15 bug fixes
#
# 🔄 Upgrading Package Installer CLI...
# ├── Downloading v2.1.0... ✓
# ├── Installing dependencies... ✓
# ├── Migrating configuration... ✓
# ├── Updating cache format... ✓
# └── Verifying installation... ✓
#
# ✅ Successfully upgraded to v2.1.0!
```

**Breaking Change Detection:**
```bash
# Check for breaking changes
pi upgrade-cli --check

# Breaking Change Analysis:
# ⚠️  Breaking Changes Detected in v3.2.0:
# ├── 🔧 Configuration format changed
# ├── 📂 Cache directory structure updated
# ├── 🚫 Deprecated commands removed
# └── 📦 New Node.js requirement: v18+
#
# 🛠️ Migration Required:
# ├── Backup current configuration
# ├── Update Node.js to v18+
# ├── Migrate cache files
# └── Update project scripts
```

**Version Management:**
```bash
# Show version information
pi upgrade-cli --info

# Version Information:
# 📦 Package Installer CLI
# ├── Current: 2.1.0
# ├── Latest Stable: 2.1.0
# ├── Latest Beta: 2.2.0-beta.1
# ├── Next Major: 3.2.0-alpha.1
# └── Release Schedule: Monthly
```

**Upgrade Features:**

**🔄 Intelligent Updates:**
- Automatic version checking
- Release note integration
- Breaking change detection
- Compatibility verification
- Rollback support

**📦 Package Manager Integration:**
- Works with npm, yarn, pnpm
- Global installation management
- Permission handling
- Dependency conflict resolution

**🔧 Configuration Migration:**
- Automatic config updates
- Cache format migration
- User preference preservation
- Backward compatibility

**📊 Update Analytics:**
- Update success tracking
- Performance impact measurement
- Feature usage analysis
- Error reporting

**Available Options:**
| Option | Description | Example |
|--------|-------------|---------|
| `--check` | Check for updates only | `--check` |
| `--beta` | Include beta versions | `--beta` |
| `--force` | Force upgrade without checks | `--force` |
| `--rollback` | Rollback to previous version | `--rollback` |
| `--info` | Show version information | `--info` |

**Rollback Support:**
```bash
# Rollback to previous version
pi upgrade-cli --rollback

# Rollback options:
# ├── v2.0.5 (Previous stable)
# ├── v2.0.4 (Last known good)
# └── v1.9.8 (Legacy version)
```

---

### `deploy` Command

**Status:** 🚧 Coming Soon

Automated deployment to various cloud platforms with intelligent configuration.

**Planned Features:**
- **Cloud Platforms:** Vercel, Netlify, AWS, Google Cloud
- **Container Deployment:** Docker, Kubernetes
- **CI/CD Integration:** GitHub Actions, GitLab CI
- **Environment Management:** Staging, production environments
- **Database Deployment:** Automated database setup
- **Domain Configuration:** Custom domain setup and SSL

**Future Syntax:**
```bash
# Deploy to cloud platforms
pi deploy vercel
pi deploy netlify --domain=myapp.com
pi deploy aws --region=us-east-1

# Container deployment
pi deploy docker --registry=dockerhub
pi deploy kubernetes --cluster=production
```

## 🔧 Advanced Features

### Environment Variable Management

**Automatic Environment Setup:**
- Detects `.env.example` files
- Creates `.env` with prompts for required values
- Validates environment variable formats
- Suggests secure default values

**Environment Validation:**
```bash
# Validate environment configuration
pi env --validate

# Validation checks:
# ├── Required variables present
# ├── Format validation (URLs, emails, etc.)
# ├── Security best practices
# └── Platform-specific requirements
```

### User Preference Caching

**Smart Defaults:**
- Remembers framework preferences
- Caches package manager choices
- Stores naming conventions
- Tracks feature usage patterns

**Preference Management:**
```bash
# View cached preferences
pi cache info --preferences

# Reset user preferences
pi cache clear preferences
```

### Cross-Platform Compatibility

**Operating System Support:**
- Windows (PowerShell, CMD)
- macOS (zsh, bash)
- Linux (bash, zsh, fish)

**Package Manager Detection:**
- Automatic detection based on lock files
- Fallback to user preferences
- Cross-platform command translation

### Performance Optimization

**Caching Strategy:**
- Template file caching (7-day expiry)
- Package version caching (1-hour expiry)
- Project analysis caching (2-hour expiry)
- System environment caching (24-hour expiry)

**Parallel Processing:**
- Concurrent dependency analysis
- Parallel template downloads
- Simultaneous package updates
- Background cache optimization

## 🛠️ Configuration

### Global Configuration

**Configuration File:** `~/.package-installer-cli/config.json`

```json
{
  "preferences": {
    "packageManager": "pnpm",
    "language": "typescript",
    "framework": "react",
    "styling": "tailwindcss"
  },
  "cache": {
    "enabled": true,
    "maxSize": "500MB",
    "autoCleanup": true
  },
  "analytics": {
    "enabled": true,
    "anonymous": true
  }
}
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PKG_CLI_CACHE_DIR` | Custom cache directory | `~/.package-installer-cli/` |
| `PKG_CLI_CONFIG_DIR` | Configuration directory | `~/.package-installer-cli/` |
| `PKG_CLI_DISABLE_CACHE` | Disable all caching | `false` |
| `PKG_CLI_SILENT` | Suppress output | `false` |

## 🚨 Troubleshooting

### Common Issues & Solutions

**Template Creation Fails:**
```bash
# Check permissions and available space
ls -la /path/to/project/directory
df -h

# Try alternative directory
pi create ~/Desktop/my-project

# Clear cache and retry
pi cache clear templates
pi create my-project
```

**Package Installation Errors:**
```bash
# Verify package manager installation
npm --version && yarn --version && pnpm --version

# Clear package manager cache
npm cache clean --force
yarn cache clean
pnpm store prune

# Try with different package manager
pi create my-project --package-manager=npm
```

**Analysis Command Issues:**
```bash
# Ensure you're in a valid project directory
pwd && ls -la

# Check file permissions
ls -la package.json

# Run with verbose output
pi analyze --verbose

# Clear analysis cache
pi cache clear analysis
```

**CLI Upgrade Problems:**
```bash
# Check current installation
which pi
pi --version

# Reinstall CLI
npm uninstall -g @0xshariq/package-installer
npm install -g @0xshariq/package-installer

# Clear global cache
pi cache clear all
```

### Debug Mode

Enable detailed logging for troubleshooting:

```bash
# Enable verbose output
pi create my-project --verbose

# Enable debug mode
DEBUG=pi:* pi create my-project

# Export debug information
pi doctor --export=debug.json
```

### Getting Help

**Built-in Help:**
- Use `--help` with any command for detailed usage
- Use `pi doctor` for comprehensive diagnostics
- Use `pi env` for environment analysis

**Community Support:**
- 📚 [Documentation](https://github.com/0xshariq/package-installer-cli/wiki)
- 🐛 [Bug Reports](https://github.com/0xshariq/package-installer-cli/issues)
- 💬 [Discussions](https://github.com/0xshariq/package-installer-cli/discussions)
- 🚀 [Feature Requests](https://github.com/0xshariq/package-installer-cli/issues/new?template=feature_request.md)

## 📈 Performance Metrics

### Speed Improvements with Caching

| Operation | Without Cache | With Cache | Improvement |
|-----------|---------------|------------|-------------|
| Project Creation | 45-60 seconds | 8-12 seconds | **5x faster** |
| Project Analysis | 10-15 seconds | 3-5 seconds | **3x faster** |
| Template Loading | 5-8 seconds | 1-2 seconds | **4x faster** |
| Package Updates | 30-45 seconds | 15-20 seconds | **2x faster** |
| Environment Check | 8-12 seconds | 2-3 seconds | **4x faster** |

### Resource Usage

| Resource | Typical Usage | Peak Usage | Optimization |
|----------|---------------|------------|--------------|
| Memory | 50-100MB | 200MB | Streaming processing |
| Disk Space | 100-200MB | 500MB | Automatic cleanup |
| Network | Minimal | High during updates | Smart caching |
| CPU | Low | Medium during builds | Parallel processing |

---

**Related Documentation:**
- 📋 [Features Documentation](features.md) - Comprehensive feature overview
- 🎨 [Templates Documentation](templates.md) - Template guides and customization
- 🚀 [Deployment Documentation](deploy.md) - Deployment strategies and platforms

**Repository:** [Package Installer CLI on GitHub](https://github.com/0xshariq/package-installer-cli)
