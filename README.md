# Package Installer CLI (Rust Wrapper)

[![Crates.io](https://img.shields.io/crates/v/package-installer-cli.svg)](https://crates.io/crates/package-installer-cli)
[![npm version](https://img.shields.io/npm/v/@0xshariq/package-installer.svg)](https://www.npmjs.com/package/@0xshariq/package-installer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)

A **cross-platform, interactive CLI** to scaffold modern web application templates with support for multiple frameworks, languages, and development tools. This Rust wrapper automatically manages Node.js dependencies and provides both local and global installation options.

---

## 🚀 Installation Options

### Option 1: Local NPM Installation (Recommended)

```bash
# Using npm (recommended)
npm install @0xshariq/package-installer

# Using yarn
yarn add @0xshariq/package-installer

# Using pnpm
pnpm add @0xshariq/package-installer
```

**Benefits:**
- ✅ **Always Works**: No compatibility issues with dependencies
- ✅ **Latest Version**: Gets the most up-to-date CLI directly from npm
- ✅ **Project-Scoped**: Keeps CLI version consistent with your project
- ✅ **Full Feature Set**: Access to all CLI features without limitations

### Option 2: Global Installation via Cargo

```bash
cargo install package-installer-cli
```

**Benefits:**
- ✅ **Smart Detection**: Automatically finds local npm installations
- ✅ **Bundled Fallback**: Includes bundled CLI for offline use
- ✅ **Cross-Platform**: Works on Windows, macOS, and Linux
- ✅ **Single Command**: Install once, use anywhere

## 🎯 How It Works

The Rust wrapper intelligently manages the TypeScript CLI:

1. **🔍 Local Priority**: First checks for local npm/yarn/pnpm installations in your project
2. **📦 Bundled Fallback**: Uses bundled CLI version if no local installation found
3. **🚀 Seamless Execution**: Automatically runs the best available version
4. **⚡ Zero Configuration**: No manual setup or dependency installation required

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/en/download/)
- **Package Manager** - npm, yarn, or pnpm (npm comes with Node.js)

---

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

## 🎯 Usage

### Global Usage (after `cargo install`)

```bash
# Create a new project
pi create my-app

# Get help
pi --help

# List available templates  
pi list

# Analyze existing project
pi analyze
```

### Local Usage (after `npm install`)

```bash
# Using npx (recommended)
npx pi create my-app

# Using direct path
./node_modules/.bin/pi create my-app

# Add to package.json scripts
{
  "scripts": {
    "scaffold": "pi create",
    "analyze": "pi analyze"
  }
}
```

## 🛠️ How to Use

### With Local Installation (Recommended)

```bash
# Install locally in your project
npm install @0xshariq/package-installer

# Use with npx
npx pi create my-app

# Or add to package.json scripts
{
  "scripts": {
    "create": "pi create"
  }
}
```

### With Global Cargo Installation

```bash
# Install globally
cargo install package-installer-cli

# Use directly (will find local installation if available)
pi create my-app

# Or use the binary name directly
package-installer-cli create my-app
```

### Priority Order

The Rust wrapper checks for CLI in this order:

1. **Local npm packages** (./node_modules/@0xshariq/package-installer)
2. **Parent directory npm packages** (up to 5 levels)
3. **Bundled standalone version** (bundle/pkg-ready/index.js)
4. **Bundled native executable** (bundle/executables/package-installer-[platform])

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📋 Commands](https://github.com/0xshariq/package-installer-cli/tree/main/docs/commands.md) | Complete command reference with examples |
| [⚡ Features](https://github.com/0xshariq/package-installer-cli/tree/main/docs/features.md) | Detailed feature documentation and usage |
| [🎨 Templates](https://github.com/0xshariq/package-installer-cli/tree/main/docs/templates.md) | Available templates and customization options |
| [🚀 Deployment](https://github.com/0xshariq/package-installer-cli/tree/main/docs/deploy.md) | Deployment options and platform integration |

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

*For complete command documentation, see [commands](https://github.com/0xshariq/package-installer-cli/tree/main/docs/commands.md)*

## 🏗️ Supported Project Types

| Language/Framework | Templates | Package Managers |
|-------------------|-----------|------------------|
| **JavaScript/TypeScript** | React, Next.js, Express, Angular, Vue | npm, yarn, pnpm |
| **Python** | Django, Flask, FastAPI | pip, poetry |
| **Rust** | Basic, Advanced, Web | cargo |
| **Go** | CLI, Web, API | go mod |
| **Ruby** | Rails, Sinatra | bundler |
| **PHP** | Laravel, Symfony | composer |

*For detailed template information, see [templates](https://github.com/0xshariq/package-installer-cli/tree/main/docs/templates.md)*

## 🎯 System Requirements

- **Node.js**: 18.0.0 or higher
- **Operating Systems**: Windows, macOS, Linux
- **Package Managers**: npm, yarn, or pnpm
- **Git**: Required for project initialization

## 🐛 Troubleshooting

### Common Issues & Solutions

#### "Node.js not found" Error
```bash
# Install Node.js from https://nodejs.org
# Or use package managers:

# macOS (Homebrew)  
brew install node

# Ubuntu/Debian
sudo apt-get install nodejs npm

# Windows (Chocolatey)
choco install nodejs

# Verify installation
node --version
npm --version
```

#### "Dependencies installation failed"
```bash
# Option 1: Use local installation
npm install @0xshariq/package-installer
npx pi create my-app

# Option 2: Clear cache and retry
rm -rf ~/.cache/.package-installer-cli  # Linux/macOS
pi create my-app

# Option 3: Manual installation
cd ~/.cache/.package-installer-cli
npm install --production
```

#### "Permission denied" on Linux/macOS
```bash
# Fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH

# Or use local installation
npx @0xshariq/package-installer create my-app
```

### Cache Management

Cache locations:
- **Linux**: `~/.cache/.package-installer-cli/`
- **macOS**: `~/Library/Caches/.package-installer-cli/`
- **Windows**: `%LOCALAPPDATA%\.package-installer-cli\`

Clear cache:
```bash
# Linux/macOS
rm -rf ~/.cache/.package-installer-cli

# Windows (PowerShell)
Remove-Item -Recurse -Force "$env:LOCALAPPDATA\.package-installer-cli"
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/0xshariq/package-installer-cli/tree/main/CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **RUST Crate**: [package-installer-cli](https://crates.io/crates/package-installer-cli)
- **GitHub Repository**: [package-installer-cli](https://github.com/0xshariq/rust_package-installer-cli)
- **Issues & Feedback**: [GitHub Issues](https://github.com/0xshariq/rust_package-installer-cli/issues)

---

**Happy coding! 🚀** Create something amazing with Package Installer CLI.
