# Microservices

## Documentation

Detailed documentation lives in the `docs/` folder:

- [Architecture Overview](docs/ARCHITECTURE.md) — System design, principles, and network model
- [API Gateway](docs/GATEWAY.md) — Routing, auth verification, rate limiting
- [AuthMS](docs/AUTH-MS.md) — Authentication, tokens, user management
- [AgentMS](docs/AGENT-MS.md) — Agent lifecycle and business logic
- [Deployment Guide](docs/DEPLOYMENT.md) — Local, staging, and production setup

## Architecture

```
Client → Load Balancer → Gateway (:3000) → AuthMS (:4001) / AgentMS (:4002)
```

## Services

| Service | Port | Description                                   |
| ------- | ---- | --------------------------------------------- |
| Gateway | 3000 | API routing, auth verification, rate limiting |
| AuthMS  | 4001 | User registration, login, token management    |
| AgentMS | 4002 | Agent CRUD operations (protected)             |

## Quick Start

### With Docker (recommended)

```bash
cd server
docker compose up --build
```

### Without Docker

Requires MongoDB running locally on port 27017.

```bash
# Terminal 1 — AuthMS
cd auth-ms && npm install && npm run dev

# Terminal 2 — AgentMS
cd agent-ms && npm install && npm run dev

# Terminal 3 — Gateway
cd gateway && npm install && npm run dev
```

## API Endpoints

### Auth (public)

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get tokens
- `POST /api/auth/refresh` — Refresh access token

### Agents (protected — requires Bearer token)

- `POST /api/agents` — Create an agent
- `GET /api/agents` — List user's agents
- `GET /api/agents/:id` — Get agent by ID
- `PUT /api/agents/:id` — Update an agent
- `DELETE /api/agents/:id` — Archive an agent

### Health

- `GET /health` — Gateway health
- `GET http://localhost:4001/health` — AuthMS health
- `GET http://localhost:4002/health` — AgentMS health
