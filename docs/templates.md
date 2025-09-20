# 🎨 Package Installer CLI - Templates Documentation

This document provides comprehensive information about all available templates and customization options in Package Installer CLI.

## 📋 Template Overview

Package Installer CLI offers a wide variety of pre-configured templates for modern web development, system programming, and backend services.

### Available Template Categories

| Category | Templates | Languages | Status |
|----------|-----------|-----------|--------|
| **Frontend** | React, Next.js, Angular, Vue.js | TypeScript, JavaScript | ✅ Available |
| **Backend** | Express.js, NestJS | TypeScript, JavaScript | ✅ Available |
| **Fullstack** | React+Express, React+NestJS | TypeScript, JavaScript | ✅ Available |
| **System** | Rust Basic, Rust Advanced | Rust | ✅ Available |
| **Mobile** | React Native | TypeScript, JavaScript | 🚧 Coming Soon |
| **Desktop** | Electron, Tauri | TypeScript, JavaScript, Rust | 🚧 Coming Soon |

## 🚀 Frontend Templates

### React Templates

**React (Vite) Template**
- **Bundle**: Vite for lightning-fast development
- **Language Options**: TypeScript, JavaScript
- **Styling**: Tailwind CSS, Material-UI, CSS Modules
- **Features**: Hot reload, ESLint, Prettier, modern React patterns

```bash
# Create React project
pi create my-react-app
# Select: React -> Vite -> TypeScript -> Tailwind CSS
```

**Project Structure:**
```
my-react-app/
├── src/
│   ├── components/         # Reusable React components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── utils/             # Utility functions
│   ├── styles/            # Global styles
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── README.md              # Project documentation
```

### Next.js Templates

**Next.js App Router Template**
- **Routing**: App Router with server components
- **Language Options**: TypeScript, JavaScript
- **Styling**: Tailwind CSS, CSS Modules, styled-components
- **Features**: SSR, SSG, API routes, middleware, shadcn/ui integration

```bash
# Create Next.js project
pi create my-nextjs-app
# Select: Next.js -> App Router -> TypeScript -> Tailwind CSS -> shadcn/ui
```

**Project Structure:**
```
my-nextjs-app/
├── app/
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   ├── loading.tsx        # Loading UI
│   └── error.tsx          # Error UI
├── components/
│   ├── ui/                # shadcn/ui components
│   └── custom/            # Custom components
├── lib/
│   └── utils.ts           # Utility functions
├── public/                # Static assets
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── components.json        # shadcn/ui configuration
```

### Angular Templates

**Angular Material Template**
- **Version**: Latest Angular CLI
- **Language**: TypeScript
- **UI Library**: Angular Material, Tailwind CSS
- **Features**: Angular CLI, routing, services, guards

```bash
# Create Angular project
pi create my-angular-app
# Select: Angular -> Material UI -> TypeScript -> Routing
```

### Vue.js Templates

**Vue 3 Composition API Template**
- **Bundle**: Vite for fast development
- **Language Options**: TypeScript, JavaScript
- **API**: Composition API with script setup
- **Features**: Vue Router, Pinia state management, modern tooling

```bash
# Create Vue.js project
pi create my-vue-app
# Select: Vue.js -> Composition API -> TypeScript -> Vue Router
```

## 🔧 Backend Templates

### Express.js Templates

**Express TypeScript API Template**
- **Language**: TypeScript with strict configuration
- **Features**: RESTful API structure, middleware, error handling
- **Database**: MongoDB, PostgreSQL integration options
- **Security**: CORS, helmet, rate limiting

```bash
# Create Express API
pi create my-express-api
# Select: Express.js -> TypeScript -> MongoDB -> Authentication
```

**Project Structure:**
```
my-express-api/
├── src/
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   └── app.ts            # Express application setup
├── tests/                # Test files
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── nodemon.json          # Development configuration
```

### NestJS Templates

**NestJS Enterprise Template**
- **Language**: TypeScript
- **Architecture**: Modular, scalable architecture
- **Features**: GraphQL, REST APIs, microservices support
- **Database**: TypeORM, Prisma integration

```bash
# Create NestJS project
pi create my-nestjs-api
# Select: NestJS -> GraphQL -> PostgreSQL -> JWT Auth
```

## 🏗️ Fullstack Templates

### React + Express Fullstack

**React + Express + shadcn/ui Template**
- **Frontend**: React with Vite, TypeScript, shadcn/ui
- **Backend**: Express.js with TypeScript
- **Database**: MongoDB or PostgreSQL
- **Authentication**: JWT with refresh tokens

```bash
# Create fullstack project
pi create my-fullstack-app
# Select: React+Express -> TypeScript -> shadcn/ui -> MongoDB
```

### React + NestJS Fullstack

**React + NestJS + shadcn/ui Template**
- **Frontend**: React with modern tooling
- **Backend**: NestJS with GraphQL
- **Database**: PostgreSQL with TypeORM
- **Features**: Real-time subscriptions, file uploads

## ⚙️ System Programming Templates

### Rust Templates

**Rust Basic Template**
- **Type**: Binary crate with basic structure
- **Features**: Cargo workspace, error handling, logging
- **Dependencies**: Common crates (serde, tokio, clap)

```bash
# Create Rust project
pi create my-rust-app
# Select: Rust -> Basic -> Binary Crate
```

**Rust Advanced Template**
- **Type**: Library and binary crate
- **Features**: Async runtime, web server, database integration
- **Architecture**: Modular design with traits and generics

**Project Structure:**
```
my-rust-app/
├── src/
│   ├── main.rs           # Application entry point
│   ├── lib.rs            # Library root
│   ├── config/           # Configuration modules
│   ├── handlers/         # Request handlers
│   └── utils/            # Utility modules
├── tests/                # Integration tests
├── Cargo.toml            # Project manifest
├── Cargo.lock            # Dependency lock file
└── README.md             # Project documentation
```

## 🎯 Template Customization

### Styling Options

**Tailwind CSS Integration**
- Pre-configured Tailwind CSS setup
- Custom color schemes and themes
- Responsive design utilities
- Dark mode support

**Material-UI Integration**
- Component library setup
- Theme customization
- Icon integration
- Responsive breakpoints

**shadcn/ui Integration**
- Modern component system
- Customizable design system
- Accessibility features
- TypeScript support

### Development Tools

**ESLint Configuration**
- Strict TypeScript rules
- React/Vue specific rules
- Accessibility linting
- Custom rule sets

**Prettier Setup**
- Consistent code formatting
- Integration with ESLint
- Editor configuration
- Git hooks integration

**Testing Setup**
- Jest for unit testing
- React Testing Library
- Cypress for E2E testing
- Coverage reporting

## 📦 Package Manager Support

### Automatic Detection

The CLI automatically detects and uses your preferred package manager:

**Supported Package Managers:**
- **npm**: Default Node.js package manager
- **yarn**: Fast, reliable package manager
- **pnpm**: Efficient package manager with hard links

**Detection Logic:**
1. Check for existing lock files (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`)
2. Check global installation preferences
3. Fall back to npm as default

### Installation Process

**Automatic Installation Features:**
- Dependency resolution and installation
- Development dependencies setup
- Script configuration
- Git repository initialization
- Initial commit creation

## 🔧 Configuration Options

### Environment Variables

Templates include `.env.example` files with common configurations:

```env
# Database Configuration
DATABASE_URL=mongodb://localhost:27017/myapp
POSTGRES_URL=postgresql://user:password@localhost:5432/myapp

# Authentication
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=7d

# API Configuration
PORT=3000
NODE_ENV=development

# External Services
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...
```

### TypeScript Configuration

**Strict TypeScript Setup:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Build Configuration

**Vite Configuration Example:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
```

## 🚀 Template Features

### Modern Development Experience

**Hot Reload & Fast Refresh**
- Instant feedback during development
- State preservation across reloads
- Error overlay with helpful messages

**TypeScript Integration**
- Strict type checking
- IntelliSense support
- Automatic type generation
- Import path optimization

**Build Optimization**
- Tree shaking for smaller bundles
- Code splitting for better performance
- Asset optimization
- Production-ready builds

### Deployment Ready

**Docker Support**
- Multi-stage Dockerfiles
- Production optimized images
- Development containers
- Docker Compose setup

**CI/CD Integration**
- GitHub Actions workflows
- Automated testing
- Build and deployment pipelines
- Environment-specific configs

## 🔮 Upcoming Templates

### Planned Templates

**Mobile Development:**
- React Native with Expo
- Flutter applications
- Progressive Web Apps (PWA)

**Desktop Applications:**
- Electron with React/Vue
- Tauri with Rust backend
- Native desktop apps

**Backend Services:**
- FastAPI Python templates
- Django REST framework
- Go web services
- Ruby on Rails API

**Microservices:**
- Docker containerized services
- Kubernetes deployments
- Service mesh integration
- Message queue systems

## 🤝 Custom Templates

### Creating Custom Templates

**Template Structure:**
```
custom-template/
├── template/             # Template files
├── template.json         # Template configuration
├── hooks/               # Template hooks
│   ├── pre-install.js   # Pre-installation logic
│   └── post-install.js  # Post-installation logic
└── README.md            # Template documentation
```

**Template Configuration:**
```json
{
  "name": "custom-react-template",
  "description": "Custom React template with specific features",
  "version": "1.0.0",
  "author": "Your Name",
  "language": "typescript",
  "framework": "react",
  "features": ["tailwind", "testing", "docker"],
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Contributing Templates

We welcome template contributions! Please:
1. Follow the template structure guidelines
2. Include comprehensive documentation
3. Test with multiple configurations
4. Submit pull requests with examples

---

For more information, see:
- [Commands Documentation](commands.md)
- [Features Documentation](features.md)
- [Deployment Documentation](deploy.md)