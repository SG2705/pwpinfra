# Microservices

## Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [API Gateway](docs/GATEWAY.md)
- [AuthMS](docs/AUTH-MS.md)
- [AgentMS](docs/AGENT-MS.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## Architecture

```
Client → Load Balancer → Gateway (:3000)
                            ├── /api/auth/*   → AuthMS (:4001)
                            └── /api/agents/* → AgentMS (:4002)
```

## Services

| Service | Port | Description                               |
| ------- | ---- | ----------------------------------------- |
| Gateway | 3000 | Routing, auth verification, rate limiting |
| AuthMS  | 4001 | Registration, login, token management     |
| AgentMS | 4002 | Agent CRUD (protected)                    |

## Quick Start

### Docker (recommended)

```bash
cd server
docker compose up --build
```

### Manual

```bash
cd server
npm install
npm run install:all
npm run dev:all
```

## Scripts

| Command               | Description                      |
| --------------------- | -------------------------------- |
| `npm run install:all` | Install all service dependencies |
| `npm run dev:all`     | Start all services concurrently  |
| `npm run clean`       | Remove all node_modules          |
| `npm run lint:all`    | Lint fix all services            |
| `npm run format:all`  | Prettier format all services     |

## API Endpoints

### Auth (public)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

### Agents (protected — requires Bearer token)

- `POST /api/agents`
- `GET /api/agents`
- `GET /api/agents/:id`
- `PUT /api/agents/:id`
- `DELETE /api/agents/:id`

### Health

- `GET /health` (on each service)

## Tech Stack

- Node.js 20 + Express + ES Modules
- MongoDB + Mongoose
- JWT (access + refresh tokens)
- Docker + Docker Compose
- ESLint (Airbnb) + Prettier + Husky
