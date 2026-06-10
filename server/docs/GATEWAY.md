# API Gateway

## Purpose

The API Gateway is the **single entry point** for all client traffic. It acts as a reverse proxy that routes requests to the correct microservice, enforces authentication, and applies shared policies (rate limiting, CORS, logging).

No client ever communicates directly with AuthMS or AgentMS — everything flows through the gateway.

## Port

`3000`

## Responsibilities

| Concern          | How It's Handled                                                        |
| ---------------- | ----------------------------------------------------------------------- |
| Routing          | Path-based proxying (`/api/auth/*` → AuthMS, `/api/agents/*` → AgentMS) |
| Authentication   | Calls AuthMS `/api/auth/verify` before forwarding to protected services |
| Rate Limiting    | 100 requests per 15-minute window per IP                                |
| Security Headers | Helmet middleware                                                       |
| CORS             | Configurable allowed origins                                            |
| Logging          | Morgan (combined format)                                                |
| Error Handling   | Centralized error handler, no stack traces in production                |

## Request Flow

### Public Route (e.g., `/api/auth/login`)

```
Client → Gateway → AuthMS → Response flows back
```

### Protected Route (e.g., `/api/agents`)

```
Client → Gateway → [Auth Middleware] → AuthMS /verify →
  ├── Invalid token → 401 returned immediately
  └── Valid token → inject headers → Proxy to AgentMS → Response
```

## Headers Injected by Gateway

After successful auth verification, the gateway adds these headers before forwarding:

| Header         | Value                 | Purpose                                       |
| -------------- | --------------------- | --------------------------------------------- |
| `x-user-id`    | MongoDB ObjectId      | Identifies the authenticated user             |
| `x-user-roles` | Comma-separated roles | Authorization context for downstream services |

## Directory Structure

```
gateway/
├── Dockerfile
├── package.json
├── .env
└── src/
    ├── index.js                 ← Entry point
    ├── app.js                   ← Express app setup
    ├── config/
    │   ├── env.js               ← Environment variables
    │   └── services.js          ← Service registry
    ├── middleware/
    │   ├── authMiddleware.js    ← Token verification via AuthMS
    │   ├── rateLimiter.js       ← express-rate-limit config
    │   └── errorHandler.js      ← Global error handler
    └── routes/
        ├── proxy.routes.js      ← Proxy rules for each service
        └── health.routes.js     ← Health check endpoint
```

## Configuration

| Variable                  | Default               | Description             |
| ------------------------- | --------------------- | ----------------------- |
| `PORT`                    | 3000                  | Gateway port            |
| `AUTH_SERVICE_URL`        | http://localhost:4001 | AuthMS internal URL     |
| `AGENT_SERVICE_URL`       | http://localhost:4002 | AgentMS internal URL    |
| `RATE_LIMIT_WINDOW_MS`    | 900000 (15 min)       | Rate limit window       |
| `RATE_LIMIT_MAX_REQUESTS` | 100                   | Max requests per window |

## Adding a New Service

1. Add the service config to `src/config/services.js`
2. Add a proxy rule in `src/routes/proxy.routes.js`
3. If protected, apply `authMiddleware` before the proxy
4. Update `docker-compose.yml` with the new service
5. Update this documentation

## Future Enhancements

- **Circuit breaker** — Prevent cascading failures when a downstream service is unhealthy (e.g., using `opossum`)
- **Request/response transformation** — Modify payloads before proxying (API versioning, field filtering)
- **API key authentication** — Support both JWT and API key auth for different client types
- **WebSocket proxying** — Relay WebSocket connections for real-time features
- **Distributed tracing** — Add correlation IDs to trace requests across services (OpenTelemetry)
- **Response caching** — Cache frequent read-heavy responses at the gateway level
- **Load balancing across instances** — Round-robin between multiple instances of the same service
- **GraphQL gateway** — Aggregate multiple REST services behind a single GraphQL endpoint
