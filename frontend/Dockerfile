# Multi-stage Dockerfile for the Vite React frontend
# 1) Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install deps (use lockfile for reproducible builds)
COPY package-lock.json package.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build

# 2) Production stage - nginx serves the built files
FROM nginx:stable-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing and caching
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
