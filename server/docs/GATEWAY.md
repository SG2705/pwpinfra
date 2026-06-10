# API Gateway

## Purpose

The API Gateway is the **single entry point** for all
client traffic. It acts as a reverse proxy that routes
requests to the correct microservice, enforces
authentication, and applies shared policies.

No client ever communicates directly with AuthMS or
AgentMS — everything flows through the gateway.

## Port

`3000`

## Responsibilities

| Concern       | How It's Handled                |
| ------------- | ------------------------------- |
| Routing       | Path-based proxying             |
| Auth          | Calls AuthMS `/api/auth/verify` |
| Rate Limiting | 100 req / 15 min per IP         |
| Security      | Helmet middleware               |
| CORS          | Configurable allowed origins    |
| Logging       | Morgan (combined format)        |
| Errors        | Centralized error handler       |

## Request Flow

### Public Route (`/api/auth/login`)

```
Client → Gateway → AuthMS → Response
```

### Protected Route (`/api/agents`)

```
Client → Gateway → [Auth Middleware] →
  ├── Invalid token → 401
  └── Valid → inject headers → AgentMS → Response
```

## Headers Injected by Gateway

| Header         | Value           | Purpose         |
| -------------- | --------------- | --------------- |
| `x-user-id`    | ObjectId        | Identifies user |
| `x-user-roles` | Comma-separated | Authorization   |

## Directory Structure

```
gateway/
├── Dockerfile
├── .dockerignore
├── .eslintrc.json
├── .prettierrc
├── .env
├── package.json
└── src/
    ├── index.js              ← Entry point
    ├── app.js                ← Express app setup
    ├── config/
    │   ├── env.js            ← Environment variables
    │   └── services.js       ← Service registry
    ├── middleware/
    │   ├── authMiddleware.js ← Token verification
    │   ├── rateLimiter.js    ← Rate limit config
    │   └── errorHandler.js   ← Global error handler
    └── routes/
        ├── proxy.js          ← Proxy rules
        └── health.js         ← Health check
```

## Configuration

| Variable                  | Default               | Description    |
| ------------------------- | --------------------- | -------------- |
| `PORT`                    | 3000                  | Gateway port   |
| `AUTH_SERVICE_URL`        | http://localhost:4001 | AuthMS URL     |
| `AGENT_SERVICE_URL`       | http://localhost:4002 | AgentMS URL    |
| `RATE_LIMIT_WINDOW_MS`    | 900000                | Rate window    |
| `RATE_LIMIT_MAX_REQUESTS` | 100                   | Max per window |

## Adding a New Service

1. Add config to `src/config/services.js`
2. Add proxy rule in `src/routes/proxy.js`
3. If protected, apply `authMiddleware` before proxy
4. Update `docker-compose.yml`
5. Update this documentation

## Future Enhancements

- Circuit breaker for downstream failures
- Request/response transformation
- API key authentication support
- WebSocket proxying
- Distributed tracing (OpenTelemetry)
- Response caching
- GraphQL gateway aggregation
