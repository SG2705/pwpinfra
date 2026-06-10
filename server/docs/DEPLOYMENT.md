# Deployment Guide

## Environments

| Environment | Purpose                   | Infrastructure               |
| ----------- | ------------------------- | ---------------------------- |
| Local       | Development and testing   | Docker Compose               |
| Staging     | Pre-production validation | Docker Compose / single VM   |
| Production  | Live traffic              | Kubernetes / ECS / Cloud VMs |

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

This starts all services + MongoDB in isolated containers. Gateway is accessible at `http://localhost:3000`.

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

## Production Deployment

### Infrastructure Layout

```
┌─────────────────────────────────────────────────────┐
│                    PUBLIC SUBNET                      │
│                                                     │
│   ┌───────────┐     ┌───────────────────────────┐  │
│   │    DNS     │────▶│   Application Load Balancer│  │
│   │ (Route 53) │     │   - SSL/TLS termination   │  │
│   └───────────┘     │   - Health checks          │  │
│                      └──────────┬────────────────┘  │
└─────────────────────────────────┼───────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────┐
│                    PRIVATE SUBNET                     │
│                                  │                    │
│   ┌──────────────────────────────┼─────────────┐    │
│   │         Gateway Cluster (2+ instances)      │    │
│   │         Port 3000                           │    │
│   └──────────┬─────────────────────┬───────────┘    │
│              │                     │                  │
│   ┌──────────▼──────────┐  ┌──────▼──────────────┐  │
│   │  AuthMS Cluster     │  │  AgentMS Cluster     │  │
│   │  (2+ instances)     │  │  (2+ instances)      │  │
│   │  Port 4001          │  │  Port 4002           │  │
│   └──────────┬──────────┘  └──────┬──────────────┘  │
│              │                     │                  │
│   ┌──────────▼─────────────────────▼──────────────┐  │
│   │          MongoDB Replica Set                   │  │
│   │          (Primary + 2 Secondaries)             │  │
│   └───────────────────────────────────────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Container Registry

Build and push images to your registry (ECR, GCR, Docker Hub):

```bash
# Build
docker build -t your-registry/gateway:1.0.0 ./gateway
docker build -t your-registry/auth-ms:1.0.0 ./auth-ms
docker build -t your-registry/agent-ms:1.0.0 ./agent-ms

# Push
docker push your-registry/gateway:1.0.0
docker push your-registry/auth-ms:1.0.0
docker push your-registry/agent-ms:1.0.0
```

### Environment Variables (Production)

**Never commit production secrets.** Use a secrets manager (AWS Secrets Manager, Vault, K8s Secrets).

```bash
# Required for AuthMS in production
JWT_SECRET=<strong-random-256-bit-key>
JWT_REFRESH_SECRET=<different-strong-random-256-bit-key>
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/auth_db
NODE_ENV=production

# Required for Gateway in production
AUTH_SERVICE_URL=http://auth-ms-service:4001
AGENT_SERVICE_URL=http://agent-ms-service:4002
RATE_LIMIT_MAX_REQUESTS=1000
```

### Health Checks

All services expose a `/health` endpoint. Configure your load balancer / orchestrator to poll it:

| Service | Health URL                    | Expected Response     |
| ------- | ----------------------------- | --------------------- |
| Gateway | `http://gateway:3000/health`  | `{ "success": true }` |
| AuthMS  | `http://auth-ms:4001/health`  | `{ "success": true }` |
| AgentMS | `http://agent-ms:4002/health` | `{ "success": true }` |

### Scaling Guidelines

| Service | Scale When                         | Suggested Min      |
| ------- | ---------------------------------- | ------------------ |
| Gateway | CPU > 70% or latency > 200ms       | 2 instances        |
| AuthMS  | Login traffic spikes               | 2 instances        |
| AgentMS | Agent operations spike             | 2 instances        |
| MongoDB | Read replicas for read-heavy loads | 3-node replica set |

## CI/CD Pipeline (Suggested)

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Push   │───▶│  Build   │───▶│   Test   │───▶│  Deploy  │
│  to Git │    │  Images  │    │  (unit + │    │  (staging│
│         │    │          │    │  integr) │    │  → prod) │
└─────────┘    └──────────┘    └──────────┘    └──────────┘
```

1. **On push:** Lint + unit tests
2. **On merge to main:** Build Docker images, run integration tests
3. **On tag/release:** Deploy to staging, run smoke tests, promote to production

## Monitoring & Observability (Recommended)

| Concern  | Tool                    |
| -------- | ----------------------- |
| Metrics  | Prometheus + Grafana    |
| Logging  | ELK Stack or CloudWatch |
| Tracing  | OpenTelemetry + Jaeger  |
| Alerting | PagerDuty / Opsgenie    |
| Uptime   | Better Uptime / Pingdom |
