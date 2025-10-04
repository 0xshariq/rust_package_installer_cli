# Vue.js Production Dockerfile
# Created by Package Installer CLI

# Build stage
FROM node:18-alpine AS build-stage

WORKDIR /app

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
FROM nginx:stable-alpine AS production-stage

# Copy built app to nginx directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create nginx config if not provided
RUN echo 'server { \
    listen       80; \
    server_name  localhost; \
    location / { \
        root   /usr/share/nginx/html; \
        index  index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/ { \
        # Proxy to backend API if needed \
        # proxy_pass http://backend:3001/; \
        # proxy_http_version 1.1; \
        # proxy_set_header Upgrade $http_upgrade; \
        # proxy_set_header Connection "upgrade"; \
        # proxy_set_header Host $host; \
        # proxy_set_header X-Real-IP $remote_addr; \
        # proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        # proxy_set_header X-Forwarded-Proto $scheme; \
        # proxy_cache_bypass $http_upgrade; \
    } \
    error_page   500 502 503 504  /50x.html; \
    location = /50x.html { \
        root   /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
