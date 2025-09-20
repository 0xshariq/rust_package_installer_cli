# 📦 Package Installer CLI

[![npm version](https://img.shields.io/npm/v/@0xshariq/package-installer.svg)](https://www.npmjs.com/package/@0xshariq/package-installer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

A **cross-platform, interactive CLI** to scaffold modern web application templates with support for multiple frameworks, languages, and development tools. Create production-ready projects in seconds!

## 🚀 Quick Features

- **🎨 Multiple Frameworks**: React, Next.js, Express, Angular, Vue, Rust
- **🔤 Language Support**: TypeScript & JavaScript variants
- **🎭 UI Libraries**: Tailwind CSS, Material-UI, shadcn/ui
- **📦 Smart Package Management**: Auto-detects npm, yarn, pnpm
- **⚡ Lightning Fast**: Optimized template generation with intelligent caching
- **🌈 Beautiful CLI**: Gorgeous terminal interface with real-time analytics
- **🔍 Project Analysis**: Advanced dependency analysis and project insights

## ✨ New Features

- **📊 Enhanced Analytics Dashboard**: Real-time usage analytics with detailed insights
- **🎯 Smart Dependency Updates**: Project-specific dependency management for JS, Python, Rust, Go, Ruby, PHP
- **🚀 Intelligent CLI Upgrades**: Separate upgrade system with breaking change detection
- **💾 .package-installer-cli Folder**: All cache and history stored in dedicated folder
- **📈 Usage Tracking**: Comprehensive command and feature usage tracking
- **⚡ Performance Insights**: Productivity scoring and usage patterns

## 📥 Installation

```bash
# Using npm
npm install -g @0xshariq/package-installer

# Using yarn
yarn global add @0xshariq/package-installer

# Using pnpm (recommended)
pnpm add -g @0xshariq/package-installer
```

## 🎯 Quick Start

```bash
# Create new project interactively
pi create

# Analyze project with enhanced dashboard
pi analyze

# Update project dependencies only
pi update

# Upgrade CLI to latest version
pi upgrade-cli
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📋 Commands](docs/commands.md) | Complete command reference with examples |
| [⚡ Features](docs/features.md) | Detailed feature documentation and usage |
| [🎨 Templates](docs/templates.md) | Available templates and customization options |
| [🚀 Deployment](docs/deploy.md) | Deployment options and platform integration |

## 🛠️ Command Overview

| Command | Description | Usage |
|---------|-------------|-------|
| `pi create` | Create new project from templates | `pi create [name]` |
| `pi analyze` | Enhanced project analytics dashboard | `pi analyze [--detailed]` |
| `pi update` | Update project dependencies | `pi update [--latest]` |
| `pi upgrade-cli` | Upgrade CLI to latest version | `pi upgrade-cli` |
| `pi add` | Add features to existing projects | `pi add [feature]` |
| `pi doctor` | Diagnose and fix project issues | `pi doctor` |
| `pi clean` | Clean development artifacts | `pi clean [--all]` |

*For complete command documentation, see [docs/commands.md](docs/commands.md)*

## 🏗️ Supported Project Types

| Language/Framework | Templates | Package Managers |
|-------------------|-----------|------------------|
| **JavaScript/TypeScript** | React, Next.js, Express, Angular, Vue | npm, yarn, pnpm |
| **Python** | Django, Flask, FastAPI | pip, poetry |
| **Rust** | Basic, Advanced, Web | cargo |
| **Go** | CLI, Web, API | go mod |
| **Ruby** | Rails, Sinatra | bundler |
| **PHP** | Laravel, Symfony | composer |

*For detailed template information, see [docs/templates.md](docs/templates.md)*

## 🎯 System Requirements

- **Node.js**: 18.0.0 or higher
- **Operating Systems**: Windows, macOS, Linux
- **Package Managers**: npm, yarn, or pnpm
- **Git**: Required for project initialization

## 🐛 Troubleshooting

### Quick Fixes

```bash
# Clear cache and reinstall
npm cache clean --force
npm install -g @0xshariq/package-installer

# Use npx if global installation fails
npx @0xshariq/package-installer create my-app

# Check CLI status
pi doctor
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **NPM Package**: [@0xshariq/package-installer](https://www.npmjs.com/package/@0xshariq/package-installer)
- **GitHub Repository**: [package-installer-cli](https://github.com/0xshariq/package-installer-cli)
- **Issues & Feedback**: [GitHub Issues](https://github.com/0xshariq/package-installer-cli/issues)

---

**Happy coding! 🚀** Create something amazing with Package Installer CLI.
