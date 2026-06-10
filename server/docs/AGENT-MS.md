# AgentMS — Agent Service

## Purpose

AgentMS manages the **agent lifecycle** — creating,
reading, updating, and archiving agents. It handles all
business logic related to agents and is scoped to the
authenticated user (multi-tenant by design).

Requests reaching this service have already been
authenticated by the gateway. User identity is read from
`x-user-id` and `x-user-roles` headers injected by the
gateway.

## Port

`4002`

## Responsibilities

| Responsibility | Description                       |
| -------------- | --------------------------------- |
| Create Agent   | Register a new agent              |
| List Agents    | Paginated list with status filter |
| Get Agent      | Retrieve by ID (scoped to owner)  |
| Update Agent   | Modify agent properties           |
| Delete Agent   | Soft-delete (archive)             |

## API Endpoints

All endpoints are **protected** — they require a valid
token passed through the gateway.

| Method | Path              | Description             |
| ------ | ----------------- | ----------------------- |
| POST   | `/api/agents`     | Create agent            |
| GET    | `/api/agents`     | List agents (paginated) |
| GET    | `/api/agents/:id` | Get by ID               |
| PUT    | `/api/agents/:id` | Update agent            |
| DELETE | `/api/agents/:id` | Archive agent           |
| GET    | `/health`         | Health check            |

## Request/Response Examples

### Create Agent

```json
// POST /api/agents
// Headers: x-user-id: 6750a1b2c3d4e5f6a7b8c9d0

// Request
{
  "name": "Customer Support Bot",
  "description": "Handles tier-1 queries",
  "config": {
    "model": "gpt-4",
    "temperature": 0.7
  }
}

// Response (201)
{
  "success": true,
  "data": {
    "_id": "6750b2c3d4e5f6a7b8c9d0e1",
    "name": "Customer Support Bot",
    "description": "Handles tier-1 queries",
    "status": "active",
    "createdBy": "6750a1b2c3d4e5f6a7b8c9d0",
    "config": { "model": "gpt-4", "temperature": 0.7 },
    "createdAt": "2026-06-10T10:30:00.000Z",
    "updatedAt": "2026-06-10T10:30:00.000Z"
  }
}
```

### List Agents

```json
// GET /api/agents?page=1&limit=10&status=active

// Response (200)
{
  "success": true,
  "data": {
    "agents": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

## Data Model — Agent

| Field         | Type     | Description                      |
| ------------- | -------- | -------------------------------- |
| `_id`         | ObjectId | Auto-generated ID                |
| `name`        | String   | Required, max 200 chars          |
| `description` | String   | Optional, max 1000 chars         |
| `status`      | String   | `active`, `inactive`, `archived` |
| `createdBy`   | ObjectId | Reference to user                |
| `config`      | Mixed    | Flexible JSON config             |
| `createdAt`   | Date     | Auto-generated                   |
| `updatedAt`   | Date     | Auto-generated                   |

## Multi-Tenancy

Every query is scoped to the authenticated user:

```js
Agent.findOne({ _id: agentId, createdBy: userId });
```

A user can never access another user's agents.

## Directory Structure

```
agent-ms/
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
    │   └── db.js             ← MongoDB connection
    ├── controllers/
    │   └── agent.js          ← Agent logic + HTTP layer
    ├── models/
    │   └── agent.js          ← Mongoose Agent schema
    ├── routes/
    │   ├── agent.js          ← Agent route definitions
    │   └── health.js         ← Health check
    └── middleware/
        └── errorHandler.js   ← Global error handler
```

## Database

- **Database name:** `agent_db`
- **Collection:** `agents`
- **Indexes:** `{ createdBy: 1, status: 1 }` (compound)

## Future Enhancements

- Agent execution engine (run agents against prompts)
- Agent versioning and config rollback
- Agent deployment to environments
- Analytics (usage, tokens, response times)
- Agent sharing between team members
- Agent templates (pre-built configs)
- Webhook integration (Slack, GitHub triggers)
- Scheduling (cron-based agent runs)
- Knowledge base / file attachments
- Conversation history storage
- Usage quotas per user/plan
- Real-time WebSocket status updates
- Plugin system for tool integrations
