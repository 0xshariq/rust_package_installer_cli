# Full-stack React + NestJS Application Dockerfile
# Created by Package Installer CLI

# Multi-stage build for React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
COPY frontend/pnpm-lock.yaml* ./

# Install frontend dependencies
RUN \
  if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  else npm ci; \
  fi

# Copy frontend source code
COPY frontend/ .

# Build React application
RUN npm run build

# Multi-stage build for NestJS backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
COPY backend/pnpm-lock.yaml* ./

# Install backend dependencies
RUN \
  if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  else npm ci; \
  fi

# Copy backend source code
COPY backend/ .

# Build NestJS application
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup --system --gid 1001 appgroup
RUN adduser --system --uid 1001 appuser

# Copy built backend
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/dist/ ./backend/dist/
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/package*.json ./backend/
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/pnpm-lock.yaml* ./backend/

# Copy built frontend to serve from NestJS
COPY --from=frontend-builder --chown=appuser:appgroup /app/frontend/dist/ ./backend/public/

# Install only production dependencies for backend
WORKDIR /app/backend
RUN \
  if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --prod --frozen-lockfile; \
  else npm ci --only=production && npm cache clean --force; \
  fi

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the NestJS application
CMD ["node", "dist/main.js"]
