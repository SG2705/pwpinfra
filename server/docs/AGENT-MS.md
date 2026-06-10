# AgentMS — Agent Service

## Purpose

AgentMS manages the **agent lifecycle** — creating, reading, updating, and archiving agents. It handles all business logic related to agents and is scoped to the authenticated user (multi-tenant by design).

This service trusts that requests reaching it have already been authenticated by the gateway. It reads user identity from headers injected by the gateway (`x-user-id`, `x-user-roles`).

## Port

`4002`

## Responsibilities

| Responsibility | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| Create Agent   | Register a new agent with name, description, and config       |
| List Agents    | Paginated list of a user's agents with optional status filter |
| Get Agent      | Retrieve a single agent by ID (scoped to owner)               |
| Update Agent   | Modify agent properties                                       |
| Delete Agent   | Soft-delete (archive) an agent                                |

## API Endpoints

All endpoints are **protected** — they require a valid token passed through the gateway.

| Method | Path              | Description             |
| ------ | ----------------- | ----------------------- |
| POST   | `/api/agents`     | Create a new agent      |
| GET    | `/api/agents`     | List agents (paginated) |
| GET    | `/api/agents/:id` | Get agent by ID         |
| PUT    | `/api/agents/:id` | Update agent            |
| DELETE | `/api/agents/:id` | Archive agent           |
| GET    | `/health`         | Service health check    |

## Request/Response Examples

### Create Agent

```json
// POST /api/agents
// Headers: x-user-id: 6750a1b2c3d4e5f6a7b8c9d0
// Request
{
  "name": "Customer Support Bot",
  "description": "Handles tier-1 customer queries",
  "config": {
    "model": "gpt-4",
    "temperature": 0.7,
    "maxTokens": 2048
  }
}

// Response (201)
{
  "success": true,
  "data": {
    "_id": "6750b2c3d4e5f6a7b8c9d0e1",
    "name": "Customer Support Bot",
    "description": "Handles tier-1 customer queries",
    "status": "active",
    "createdBy": "6750a1b2c3d4e5f6a7b8c9d0",
    "config": {
      "model": "gpt-4",
      "temperature": 0.7,
      "maxTokens": 2048
    },
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
    "agents": [
      {
        "_id": "6750b2c3d4e5f6a7b8c9d0e1",
        "name": "Customer Support Bot",
        "status": "active",
        "createdAt": "2026-06-10T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "pages": 1
    }
  }
}
```

### Delete (Archive) Agent

```json
// DELETE /api/agents/6750b2c3d4e5f6a7b8c9d0e1

// Response (200)
{
  "success": true,
  "data": {
    "_id": "6750b2c3d4e5f6a7b8c9d0e1",
    "name": "Customer Support Bot",
    "status": "archived",
    "updatedAt": "2026-06-10T11:00:00.000Z"
  }
}
```

## Data Model — Agent

| Field         | Type     | Description                                |
| ------------- | -------- | ------------------------------------------ |
| `_id`         | ObjectId | Auto-generated unique ID                   |
| `name`        | String   | Agent name (required, max 200 chars)       |
| `description` | String   | Optional description (max 1000 chars)      |
| `status`      | String   | `active`, `inactive`, or `archived`        |
| `createdBy`   | ObjectId | Reference to user who created it           |
| `config`      | Mixed    | Flexible JSON config (model, params, etc.) |
| `createdAt`   | Date     | Auto-generated timestamp                   |
| `updatedAt`   | Date     | Auto-generated timestamp                   |

## Multi-Tenancy

Every query is scoped to the authenticated user:

```js
// Users can only see/modify their own agents
Agent.find({ createdBy: userId });
Agent.findOne({ _id: agentId, createdBy: userId });
```

A user can never access another user's agents — this is enforced at the database query level.

## Directory Structure

```
agent-ms/
├── Dockerfile
├── package.json
├── .env
└── src/
    ├── index.js
    ├── app.js
    ├── config/
    │   ├── env.js
    │   └── db.js
    ├── controllers/
    │   └── agent.controller.js
    ├── models/
    │   └── agent.model.js
    ├── routes/
    │   ├── agent.routes.js
    │   └── health.routes.js
    ├── services/
    │   └── agent.service.js
    └── middleware/
        └── errorHandler.js
```

## Database

- **Database name:** `agent_db`
- **Collections:** `agents`
- **Indexes:** Compound index on `{ createdBy: 1, status: 1 }` for efficient user-scoped queries

## Future Enhancements

- **Agent execution engine** — Actually run agents against prompts, track conversations
- **Agent versioning** — Keep history of config changes, allow rollback
- **Agent deployment** — Deploy agents to different environments (staging, production)
- **Agent analytics** — Track usage, response times, token consumption, user satisfaction
- **Agent sharing** — Allow users to share agents with team members or make them public
- **Agent templates** — Pre-built agent configs users can clone and customize
- **Webhook integration** — Trigger agents from external events (Slack, email, GitHub)
- **Agent scheduling** — Run agents on a cron schedule for automated workflows
- **File/knowledge base attachment** — Attach documents or data sources agents can reference
- **Conversation history** — Store and retrieve past agent conversations
- **Agent marketplace** — Publish and discover community agents
- **Usage quotas** — Enforce limits on agent executions per user/plan
- **Real-time status** — WebSocket updates on agent execution progress
- **Plugin system** — Extensible plugins for integrating tools (search, code execution, APIs)
