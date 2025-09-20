# 🔧 Package Installer CLI - Features Directory Documentation

This document provides comprehensive information about the **features directory** and all available features that can be added to existing projects using the `pi add` command.

## 📁 Features Directory Overview

The `features/` directory contains pre-configured integrations and features that can be added to existing projects. Each feature includes:

- **Configuration files** for different frameworks and languages
- **Installation instructions** and dependency management
- **Code templates** and implementation files
- **Environment setup** and documentation

## 🗂️ Feature Categories

### 🤖 AI Integrations (`features/ai/`)

Add AI capabilities to your applications with support for major AI providers.

**Available Providers:**
- **Claude** (Anthropic) - Advanced AI conversations and analysis
- **Gemini** (Google) - Multimodal AI capabilities
- **OpenAI** - GPT models and AI completions
- **Grok** (xAI) - Real-time AI interactions
- **OpenRouter** - Multiple AI providers through one API

**Supported Frameworks:** Next.js, Express.js, NestJS, Remix
**Languages:** JavaScript, TypeScript

```bash
# Add AI integration
pi add ai
# Select provider: Claude, Gemini, OpenAI, etc.
```

**Features Included:**
- API route handlers for AI interactions
- Authentication and API key management
- Rate limiting and error handling
- Type definitions for TypeScript projects
- Example implementations and usage guides

---

### 📊 Analytics (`features/analytics/`)

Integrate analytics and user tracking into your applications.

**Available Providers:**
- **Plausible** - Privacy-focused web analytics
- **PostHog** - Product analytics and feature flags

**Supported Frameworks:** Next.js, React, Express.js
**Languages:** JavaScript, TypeScript

```bash
# Add analytics integration
pi add analytics
# Select provider: Plausible, PostHog
```

**Features Included:**
- Analytics initialization and configuration
- Event tracking utilities
- Privacy-compliant setup
- Dashboard integration helpers
- Custom event definitions

---

### 🔐 Authentication (`features/auth/`)

Add secure authentication systems to your applications.

**Available Providers:**
- **Auth0** - Enterprise authentication solution
- **Clerk** - Modern authentication for React/Next.js
- **NextAuth.js** - Authentication for Next.js applications

**Supported Frameworks:** Next.js, Express.js, React
**Languages:** JavaScript, TypeScript

```bash
# Add authentication
pi add auth
# Select provider: Auth0, Clerk, NextAuth.js
```

**Features Included:**
- Complete authentication flow setup
- User session management
- Protected route configurations
- Role-based access control (RBAC)
- Social login integrations
- JWT token handling

---

### ☁️ AWS Services (`features/aws/`)

Integrate AWS cloud services into your applications.

**Available Services:**
- **API Gateway** - RESTful API management
- **AppSync** - GraphQL APIs with real-time subscriptions
- **Lambda** - Serverless function deployment
- **DynamoDB** - NoSQL database integration
- **S3** - Object storage and CDN
- **Cognito** - User authentication and management
- **CloudFront** - Global content delivery
- **RDS** - Relational database service
- **EC2** - Virtual server instances
- **ECS/Fargate** - Container orchestration
- **And 40+ more AWS services**

**Supported Frameworks:** All supported frameworks
**Languages:** JavaScript, TypeScript, Python, Go

```bash
# Add AWS service integration
pi add aws
# Select service: Lambda, DynamoDB, S3, etc.
```

**Features Included:**
- AWS SDK configuration and initialization
- IAM role and policy templates
- Service-specific helper functions
- Environment variable management
- Deployment configuration files
- Error handling and logging

---

### 🗄️ Database Integration (`features/database/`)

Add database connectivity and ORM integration.

**Available Databases:**
- **MongoDB** - NoSQL document database
- **PostgreSQL** - Advanced relational database
- **MySQL** - Popular relational database

**Supported Frameworks:** Express.js, NestJS, Next.js API routes
**Languages:** JavaScript, TypeScript

```bash
# Add database integration
pi add database
# Select database: MongoDB, PostgreSQL, MySQL
```

**Features Included:**
- Database connection configuration
- ORM/ODM setup (Mongoose, Prisma, TypeORM)
- Migration scripts and schemas
- CRUD operation helpers
- Connection pooling and optimization
- Environment-based configuration

---

### 🐳 Docker Integration (`features/docker/`)

Add containerization to your applications.

**Available Templates:**
- **Next.js** - Multi-stage Docker builds for Next.js
- **React** - Optimized React application containers
- **Express.js** - Node.js backend containerization
- **NestJS** - Enterprise-grade NestJS containers
- **Python/Django** - Python web application containers
- **Go** - Minimal Go application containers
- **Rust** - Efficient Rust binary containers

**Supported Frameworks:** All supported frameworks
**Languages:** All supported languages

```bash
# Add Docker configuration
pi add docker
# Select framework-specific template
```

**Features Included:**
- Multi-stage Dockerfiles for production
- Docker Compose configurations
- Development and production variants
- Health checks and monitoring
- Volume management for data persistence
- Build optimization and caching

---

### 🎯 Gitignore Templates (`features/gitignore/`)

Add comprehensive .gitignore files for different technologies.

**Available Templates:**
- **Node.js** - Comprehensive JavaScript/TypeScript ignores
- **Python** - Python-specific ignores and environments
- **Rust** - Cargo and Rust development ignores
- **Go** - Go module and binary ignores
- **Ruby** - Gem and Rails development ignores
- **Angular** - Angular CLI and build artifacts
- **React Native** - Mobile development ignores

```bash
# Add .gitignore template
pi add gitignore
# Select technology: Node.js, Python, Rust, etc.
```

**Features Included:**
- Technology-specific ignore patterns
- IDE and editor configurations
- OS-specific temporary files
- Build artifact exclusions
- Environment variable files
- Package manager lockfiles handling

---

### 📈 Monitoring (`features/monitoring/`)

Add application monitoring and observability.

**Available Providers:**
- **Datadog** - Application performance monitoring
- **OpenTelemetry** - Open-source observability framework
- **Sentry** - Error tracking and performance monitoring

**Supported Frameworks:** All web frameworks
**Languages:** JavaScript, TypeScript, Python, Go

```bash
# Add monitoring integration
pi add monitoring
# Select provider: Datadog, OpenTelemetry, Sentry
```

**Features Included:**
- APM (Application Performance Monitoring) setup
- Error tracking and alerting
- Custom metrics and dashboards
- Distributed tracing configuration
- Log aggregation and analysis
- Health check endpoints

---

### 💳 Payment Integration (`features/payment/`)

Add secure payment processing to your applications.

**Available Providers:**
- **Stripe** - Global payment processing platform
- **PayPal** - Popular online payment system
- **Razorpay** - Indian payment gateway solution

**Supported Frameworks:** Next.js, Express.js, React
**Languages:** JavaScript, TypeScript

```bash
# Add payment integration
pi add payment
# Select provider: Stripe, PayPal, Razorpay
```

**Features Included:**
- Payment form components
- Webhook handling for payment events
- Subscription management
- Refund and dispute handling
- PCI compliance helpers
- Tax calculation utilities

---

### 🗃️ Storage Services (`features/storage/`)

Add cloud storage and media management.

**Available Providers:**
- **Cloudinary** - Image and video management
- **Google Cloud Storage** - Scalable object storage
- **ImageKit.io** - Real-time image optimization

**Supported Frameworks:** All web frameworks
**Languages:** JavaScript, TypeScript

```bash
# Add storage integration
pi add storage
# Select provider: Cloudinary, Google Cloud, ImageKit
```

**Features Included:**
- File upload and management utilities
- Image optimization and transformation
- CDN integration and caching
- Secure URL generation
- Backup and redundancy setup
- Media organization helpers

---

### 🧪 Testing Frameworks (`features/testing/`)

Add comprehensive testing setups to your projects.

**Available Testing Types:**
- **Unit Testing** - Jest, Vitest, Mocha configurations
- **Integration Testing** - API and database testing
- **E2E Testing** - Cypress, Playwright setup
- **Component Testing** - React Testing Library, Vue Test Utils
- **Performance Testing** - Load testing configurations

**Supported Frameworks:** All supported frameworks
**Languages:** JavaScript, TypeScript, Python, Rust

```bash
# Add testing framework
pi add testing
# Select testing type: Unit, Integration, E2E, etc.
```

**Features Included:**
- Complete testing environment setup
- Configuration files and scripts
- Example test cases and patterns
- Continuous integration integration
- Code coverage reporting
- Test data factories and fixtures

---

### 🎨 UI Components (`features/ui/`)

Add pre-built UI component libraries and design systems.

**Available Libraries:**
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - React component library
- **Chakra UI** - Modern React component system
- **shadcn/ui** - Customizable component collection
- **Ant Design** - Enterprise-class UI library

**Supported Frameworks:** React, Next.js, Vue.js
**Languages:** JavaScript, TypeScript

```bash
# Add UI library
pi add ui
# Select library: Tailwind, Material-UI, shadcn/ui, etc.
```

**Features Included:**
- Component library installation and setup
- Theme configuration and customization
- Design system integration
- Icon libraries and asset management
- Responsive design utilities
- Accessibility features

---

## 🔧 Feature Configuration System

### Framework Support Matrix

| Feature Category | Next.js | React | Express.js | NestJS | Vue.js | Angular |
|------------------|---------|-------|------------|--------|--------|---------|
| **AI** | ✅ | ✅ | ✅ | ✅ | 🔄 | 🔄 |
| **Analytics** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Auth** | ✅ | ✅ | ✅ | ✅ | 🔄 | 🔄 |
| **AWS** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Database** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Docker** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Monitoring** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Payment** | ✅ | ✅ | ✅ | ✅ | 🔄 | 🔄 |
| **Storage** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Testing** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **UI** | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |

*Legend: ✅ Available, 🔄 Coming Soon, ❌ Not Applicable*

### Language Support

| Language | File Extensions | Configuration Support |
|----------|-----------------|---------------------|
| **JavaScript** | `.js`, `.jsx`, `.mjs` | Full support |
| **TypeScript** | `.ts`, `.tsx`, `.mts` | Full support with types |
| **Python** | `.py`, `.pyx` | Backend features only |
| **Go** | `.go` | Backend features only |
| **Rust** | `.rs` | System features only |

### Installation Actions

Each feature supports multiple installation actions:

- **`create`** - Create new files with feature code
- **`append`** - Add content to existing files
- **`prepend`** - Add content to the beginning of files
- **`install`** - Install dependencies via package managers
- **`merge`** - Merge configuration objects
- **`replace`** - Replace specific content in files

## 🚀 Usage Examples

### Interactive Feature Addition
```bash
# Start interactive feature selection
pi add

# Browse categories:
# 🤖 AI Integrations
# 📊 Analytics
# 🔐 Authentication
# ☁️  AWS Services
# 🗄️  Database
# 🐳 Docker
# 📈 Monitoring
# 💳 Payment
# 🗃️  Storage
# 🧪 Testing
# 🎨 UI Components
```

### Direct Feature Addition
```bash
# Add specific features directly
pi add auth          # Authentication setup
pi add aws-lambda    # AWS Lambda integration
pi add docker        # Docker containerization
pi add stripe        # Stripe payment processing
pi add tailwind      # Tailwind CSS setup
```

### Feature with Options
```bash
# Add feature with specific provider
pi add auth --provider=clerk
pi add database --type=postgresql
pi add monitoring --provider=datadog
```

## 📝 Contributing Features

Want to contribute a new feature? Follow these guidelines:

### Feature Structure
```
features/[category]/[provider]/
├── [framework]/
│   ├── javascript/
│   │   ├── [files to create/modify]
│   │   └── package.json (dependencies)
│   └── typescript/
│       ├── [files to create/modify]
│       └── package.json (dependencies)
├── README.md (provider documentation)
└── config.json (feature configuration)
```

### Feature Configuration
```json
{
  "name": "Feature Name",
  "description": "Feature description",
  "provider": "Provider Name",
  "supportedFrameworks": ["nextjs", "expressjs"],
  "supportedLanguages": ["javascript", "typescript"],
  "category": "category-name",
  "documentation": "README.md",
  "examples": ["example1.js", "example2.ts"]
}
```

### Testing Features
- Test installation on multiple frameworks
- Verify dependency compatibility
- Ensure TypeScript support where applicable
- Test in both development and production environments

---

For more information, see:
- [Commands Documentation](commands.md) - CLI command usage
- [Templates Documentation](templates.md) - Project template information
- [Contributing Guidelines](../CONTRIBUTING.md) - How to contribute features