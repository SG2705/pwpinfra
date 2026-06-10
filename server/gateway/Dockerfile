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

COPY --from=builder /app/node_modules ./node_modules
COPY . .

USER appuser

EXPOSE 3000

CMD ["node", "src/index.js"]
