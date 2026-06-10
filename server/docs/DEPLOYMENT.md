# Deployment Guide

## Environments

| Environment | Purpose        | Infrastructure |
| ----------- | -------------- | -------------- |
| Local       | Development    | Docker Compose |
| Staging     | Pre-production | Single VM      |
| Production  | Live traffic   | K8s / ECS      |

## Local Development

### Prerequisites

- Node.js 20+
- MongoDB 7+ (or Docker)
- npm

### Option 1: Docker Compose (Recommended)

```bash
cd server
docker compose up --build
```

Only the gateway (:3000) is exposed. AuthMS, AgentMS,
and MongoDB are internal-only.

### Option 2: Manual

```bash
# Start MongoDB
mongod --dbpath /path/to/data

# Terminal 1
cd server/auth-ms && npm install && npm run dev

# Terminal 2
cd server/agent-ms && npm install && npm run dev

# Terminal 3
cd server/gateway && npm install && npm run dev
```

### Option 3: From Root

```bash
cd server
npm install
npm run install:all
npm run dev:all
```

## Scripts (server/package.json)

| Command               | Description                     |
| --------------------- | ------------------------------- |
| `npm run install:all` | Install deps in all services    |
| `npm run dev:all`     | Start all services concurrently |
| `npm run clean`       | Remove all node_modules         |
| `npm run lint:all`    | Lint all services               |
| `npm run format:all`  | Format all services             |

## Production Deployment

### Infrastructure Layout

```
┌──────────── PUBLIC SUBNET ──────────────────┐
│  DNS → ALB (SSL) → Gateway Cluster          │
└───────────────────────┬─────────────────────┘
                        │
┌───────────────────────┼─────────────────────┐
│          PRIVATE SUBNET                      │
│   AuthMS Cluster   AgentMS Cluster           │
│   MongoDB Replica Set                        │
└──────────────────────────────────────────────┘
```

### Container Registry

```bash
docker build -t registry/gateway:1.0.0 ./gateway
docker build -t registry/auth-ms:1.0.0 ./auth-ms
docker build -t registry/agent-ms:1.0.0 ./agent-ms
```

### Docker Security

All Dockerfiles use:

- Multi-stage builds (smaller images)
- `apk upgrade` (patch OS vulnerabilities)
- Non-root user (`appuser`)
- `.dockerignore` (no .env or node_modules in image)

### Environment Variables (Production)

Use a secrets manager (AWS Secrets Manager, Vault).

```bash
JWT_SECRET=<strong-random-256-bit-key>
JWT_REFRESH_SECRET=<different-strong-key>
MONGO_URI=mongodb+srv://user:pass@cluster/auth_db
NODE_ENV=production
```

AuthMS will **refuse to start** if secrets are missing
in production mode.

### Health Checks

| Service | URL       | Response              |
| ------- | --------- | --------------------- |
| Gateway | `/health` | `{ "success": true }` |
| AuthMS  | `/health` | `{ "success": true }` |
| AgentMS | `/health` | `{ "success": true }` |

### Scaling

| Service | Scale When          | Min Instances |
| ------- | ------------------- | ------------- |
| Gateway | CPU > 70%           | 2             |
| AuthMS  | Auth traffic spikes | 2             |
| AgentMS | Agent ops spike     | 2             |
| MongoDB | Read-heavy loads    | 3-node RS     |

## CI/CD Pipeline (Suggested)

```
Push → Build → Test → Deploy (staging → prod)
```

1. **On push:** Lint + unit tests
2. **On merge to main:** Build images, integration tests
3. **On tag:** Deploy staging → smoke test → production

## Monitoring (Recommended)

| Concern  | Tool                    |
| -------- | ----------------------- |
| Metrics  | Prometheus + Grafana    |
| Logging  | ELK Stack / CloudWatch  |
| Tracing  | OpenTelemetry + Jaeger  |
| Alerting | PagerDuty / Opsgenie    |
| Uptime   | Better Uptime / Pingdom |
