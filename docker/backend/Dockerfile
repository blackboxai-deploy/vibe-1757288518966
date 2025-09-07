# Multi-stage build for Node.js backend
FROM node:20-alpine AS base

# Install system dependencies for media processing
RUN apk add --no-cache \
    ffmpeg \
    imagemagick \
    python3 \
    make \
    g++ \
    sqlite \
    curl

# Set working directory
WORKDIR /app

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Dependencies stage
FROM base AS deps
COPY backend/package*.json ./
RUN npm ci --only=production

# Development dependencies stage
FROM base AS dev-deps
COPY backend/package*.json ./
RUN npm ci

# Builder stage
FROM base AS builder
COPY --from=dev-deps /app/node_modules ./node_modules
COPY backend/ .

# Build TypeScript
RUN npm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Create necessary directories
RUN mkdir -p uploads logs temp && \
    chown -R nextjs:nodejs uploads logs temp

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4000/health || exit 1

USER nextjs

EXPOSE 4000

CMD ["node", "dist/server.js"]

# Development stage
FROM base AS development
ENV NODE_ENV=development

COPY --from=dev-deps /app/node_modules ./node_modules
COPY backend/ .

# Create directories for development
RUN mkdir -p uploads logs temp && \
    chown -R nextjs:nodejs uploads logs temp

USER nextjs

EXPOSE 4000

CMD ["npm", "run", "dev"]