# ==========================================
# Angular.js Production Dockerfile
# ==========================================
# This Dockerfile creates a production-ready Angular application
# with optimized multi-stage builds and nginx serving

# ==========================================
# Stage 1: Build the Angular application
# ==========================================
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with clean install for production
RUN npm ci --only=production

# Copy application source code
COPY . .

# Build the Angular application for production
# Customize these build commands based on your Angular setup:
# - For Angular CLI: ng build --configuration production
# - For custom builds: npm run build:prod
RUN npm run build --if-present || ng build --configuration production

# ==========================================
# Stage 2: Create production nginx server
# ==========================================
FROM nginx:alpine AS production

# Install additional tools (optional)
RUN apk add --no-cache curl

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (optional)
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Create nginx configuration for Angular SPA
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Handle Angular routing \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # Enable gzip compression \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 1024; \
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json; \
    \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header Referrer-Policy "no-referrer-when-downgrade" always; \
    \
    # Cache static assets \
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# ==========================================
# Build Instructions:
# ==========================================
# 1. Build the image:
#    docker build -t my-angular-app .
#
# 2. Run the container:
#    docker run -d -p 8080:80 my-angular-app
#
# 3. Access the application:
#    http://localhost:8080
#
# ==========================================
# Customization Options:
# ==========================================
# - Modify the build command in Stage 1 based on your Angular setup
# - Add custom nginx.conf file for advanced configuration
# - Modify port numbers as needed
# - Add environment-specific build stages
# - Include additional tools in the production image
