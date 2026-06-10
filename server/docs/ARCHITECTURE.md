# System Architecture

## Overview

This system follows a **microservices architecture** where each service is independently deployable, scalable, and maintainable. All client traffic flows through a single entry point (API Gateway), which handles cross-cutting concerns and routes requests to the appropriate service.

## High-Level Flow

```
                         ┌─────────────────┐
                         │     Client       │
                         │  (Web/Mobile)    │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  Load Balancer   │
                         │  (Nginx / ALB)   │
                         │  - SSL termination│
                         │  - Health checks  │
                         └────────┬─────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │       API Gateway         │
                    │       (Port 3000)         │
                    │                          │
                    │  • Route matching         │
                    │  • Auth verification      │
                    │  • Rate limiting          │
                    │  • CORS / Helmet          │
                    │  • Request logging        │
                    └─────┬──────────┬─────────┘
                          │          │
              ┌───────────┘          └───────────┐
              ▼                                  ▼
   ┌────────────────────┐           ┌────────────────────┐
   │      AuthMS         │           │      AgentMS        │
   │    (Port 4001)      │           │    (Port 4002)      │
   │                    │           │                    │
   │  • Register        │           │  • Create agent    │
   │  • Login           │           │  • List agents     │
   │  • Token verify    │           │  • Update agent    │
   │  • Token refresh   │           │  • Delete agent    │
   └─────────┬──────────┘           └─────────┬──────────┘
             │                                 │
             ▼                                 ▼
   ┌────────────────────┐           ┌────────────────────┐
   │   MongoDB           │           │   MongoDB           │
   │   (auth_db)         │           │   (agent_db)        │
   └────────────────────┘           └────────────────────┘
```

## Design Principles

### 1. Single Responsibility

Each service owns one domain. AuthMS handles identity.
AgentMS handles agent logic. The gateway handles routing
and cross-cutting concerns.

### 2. Database per Service

Each microservice owns its own database. No shared
databases. This ensures services can evolve, scale, and
deploy independently without schema conflicts.

### 3. Gateway as the Gatekeeper

No client communicates directly with internal services.
The gateway:

- Verifies authentication before forwarding to protected
  services
- Injects user context (`x-user-id`, `x-user-roles`) as
  headers
- Shields internal services from direct internet exposure

### 4. Stateless Services

All services are stateless. Authentication state is
carried in JWT tokens. This allows horizontal scaling —
just add more instances behind the load balancer.

### 5. Fail Fast, Fail Gracefully

- Services return clear error responses with appropriate
  HTTP status codes
- The gateway returns `503 Service Unavailable` if a
  downstream service is unreachable
- Health check endpoints enable automated monitoring

### 6. Controller-Only Pattern

Business logic lives directly in controllers — no
separate service layer. This keeps the codebase lean for
services of this size. If a service grows complex, a
service layer can be introduced later.

## Module System

All services use **ES Modules** (`import/export`) with
`"type": "module"` in package.json. Local imports require
`.js` file extensions.

## Code Quality

- **ESLint** with Airbnb base rules
- **Prettier** with 80-char line width
- **eslint-plugin-simple-import-sort** for import ordering
- **eslint-plugin-jsdoc** for documentation enforcement
- **Husky + lint-staged** for pre-commit checks

## Network Security Model

```
┌──────────── PUBLIC ZONE ────────────────────┐
│                                              │
│   Load Balancer → Gateway (:3000)            │
│                                              │
└──────────────────────────────────────────────┘
                    │
                    │ (internal network only)
                    ▼
┌──────────── PRIVATE ZONE ───────────────────┐
│                                              │
│   AuthMS (:4001)   AgentMS (:4002)           │
│   MongoDB (:27017)                           │
│                                              │
└──────────────────────────────────────────────┘
```

- Only the gateway is exposed to the internet
- Internal services use Docker networking / private
  subnets
- MongoDB is never accessible from outside the private
  network

## Communication Patterns

| Type                  | Used For                | Protocol |
| --------------------- | ----------------------- | -------- |
| Synchronous (HTTP)    | Gateway → AuthMS verify | REST     |
| Synchronous (HTTP)    | Gateway → AgentMS proxy | REST     |
| Asynchronous (future) | Inter-service events    | MQ       |

## Technology Stack

| Layer            | Technology                  |
| ---------------- | --------------------------- |
| Runtime          | Node.js 20 (Alpine)         |
| Framework        | Express.js                  |
| Module System    | ES Modules                  |
| Database         | MongoDB 7                   |
| Authentication   | JWT (access + refresh)      |
| Password Hashing | bcrypt (12 rounds)          |
| Containerization | Docker + Docker Compose     |
| Security         | Helmet, CORS, Rate Limiting |
| Linting          | ESLint + Airbnb + Prettier  |
| Git Hooks        | Husky + lint-staged         |

## Scalability Path

```
Current:  1 Gateway → 1 AuthMS → 1 AgentMS

Scaled:   LB → 3 Gateways → 2 AuthMS → 5 AgentMS
                                ↓            ↓
                          MongoDB RS    MongoDB RS
```

Each service scales independently based on load.
