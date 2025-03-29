# Stage 1: Builder
FROM node:20-alpine AS builder

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy only dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies without dev packages
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source files
COPY . .

# Ensure a standalone build
RUN echo "module.exports = {output: 'standalone'}" > next.config.js

# Build Next.js app
RUN pnpm build && rm -rf node_modules

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install PNPM
RUN corepack enable && corepack prepare pnpm@latest --activate

# 1. Copy built artifacts
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 2. Copy necessary config files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# 3. Install production dependencies only
RUN pnpm install --prod --frozen-lockfile --ignore-scripts && \
    pnpm store prune && \
    rm -rf /pnpm-store  # Remove unnecessary store data

# 4. Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nextjs && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]

