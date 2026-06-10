FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:20-alpine

# Patch OS-level vulnerabilities
RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Don't run as root
USER appuser

EXPOSE 4001

CMD ["node", "src/index.js"]
