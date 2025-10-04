# NestJS Production Dockerfile
# Created by Package Installer CLI

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files
COPY package*.json ./
COPY yarn.lock* pnpm-lock.yaml* ./

# Install dependencies
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
  else npm ci; \
  fi

# Copy source code
COPY . .

# Build the application
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm build; \
  else npm run build; \
  fi

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install production dependencies
RUN apk add --no-cache dumb-init

# Copy package files
COPY package*.json ./
COPY yarn.lock* pnpm-lock.yaml* ./

# Install only production dependencies
RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile --production && yarn cache clean; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile --prod && pnpm store prune; \
  else npm ci --only=production && npm cache clean --force; \
  fi

# Copy built application
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main"]
