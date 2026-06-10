# AuthMS — Authentication Service

## Purpose

AuthMS is responsible for **user identity management**. It handles registration, login, token issuance, token verification, and token refresh. It is the single source of truth for "who is this user?"

Other services never implement their own auth logic. They trust the gateway, which trusts AuthMS.

## Port

`4001`

## Responsibilities

| Responsibility     | Description                                    |
| ------------------ | ---------------------------------------------- |
| User Registration  | Create new accounts with hashed passwords      |
| Login              | Validate credentials, issue JWT tokens         |
| Token Verification | Validate tokens (called internally by gateway) |
| Token Refresh      | Issue new access tokens using refresh tokens   |
| User Profile       | Return authenticated user's profile data       |

## API Endpoints

| Method | Path                 | Access                  | Description              |
| ------ | -------------------- | ----------------------- | ------------------------ |
| POST   | `/api/auth/register` | Public                  | Register a new user      |
| POST   | `/api/auth/login`    | Public                  | Login and receive tokens |
| POST   | `/api/auth/verify`   | Internal (gateway only) | Verify a JWT token       |
| POST   | `/api/auth/refresh`  | Public                  | Get new access token     |
| GET    | `/api/auth/me`       | Protected               | Get current user profile |
| GET    | `/health`            | Public                  | Service health check     |

## Request/Response Examples

### Register

```json
// POST /api/auth/register
// Request
{
  "name": "Sagar Gupta",
  "email": "sagar@example.com",
  "password": "securepassword123"
}

// Response (201)
{
  "success": true,
  "data": {
    "user": {
      "id": "6750a1b2c3d4e5f6a7b8c9d0",
      "name": "Sagar Gupta",
      "email": "sagar@example.com",
      "roles": ["user"]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login

```json
// POST /api/auth/login
// Request
{
  "email": "sagar@example.com",
  "password": "securepassword123"
}

// Response (200)
{
  "success": true,
  "data": {
    "user": {
      "id": "6750a1b2c3d4e5f6a7b8c9d0",
      "name": "Sagar Gupta",
      "email": "sagar@example.com",
      "roles": ["user"]
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Verify (Internal)

```json
// POST /api/auth/verify
// Request
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

// Response (200)
{
  "success": true,
  "valid": true,
  "userId": "6750a1b2c3d4e5f6a7b8c9d0",
  "roles": ["user"]
}
```

## Data Model — User

| Field       | Type     | Description                              |
| ----------- | -------- | ---------------------------------------- |
| `_id`       | ObjectId | Auto-generated unique ID                 |
| `name`      | String   | User's full name (max 100 chars)         |
| `email`     | String   | Unique, lowercase, trimmed               |
| `password`  | String   | bcrypt hashed (12 rounds), select: false |
| `roles`     | [String] | Array of roles (`user`, `admin`)         |
| `isActive`  | Boolean  | Soft deactivation flag                   |
| `createdAt` | Date     | Auto-generated timestamp                 |
| `updatedAt` | Date     | Auto-generated timestamp                 |

## Security Measures

- Passwords hashed with **bcrypt** (12 salt rounds)
- Password field excluded from queries by default (`select: false`)
- JWT tokens signed with separate secrets for access and refresh
- Input validation on all endpoints (express-validator)
- Request body size limited to 10KB
- Deactivated accounts cannot login

## Token Strategy

| Token         | Secret               | Expiry  | Purpose                                |
| ------------- | -------------------- | ------- | -------------------------------------- |
| Access Token  | `JWT_SECRET`         | 7 days  | Authorize API requests                 |
| Refresh Token | `JWT_REFRESH_SECRET` | 30 days | Get new access tokens without re-login |

## Directory Structure

```
auth-ms/
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
    │   └── auth.controller.js
    ├── models/
    │   └── user.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   └── health.routes.js
    ├── services/
    │   └── auth.service.js
    ├── middleware/
    │   ├── errorHandler.js
    │   └── validate.js
    └── validators/
        └── auth.validator.js
```

## Database

- **Database name:** `auth_db`
- **Collections:** `users`
- **Indexes:** `email` (unique)

## Future Enhancements

- **Email verification** — Send confirmation email on registration, activate account on verification
- **Password reset** — Forgot password flow with time-limited reset tokens sent via email
- **OAuth2 / Social login** — Google, GitHub, Microsoft login integration
- **Multi-factor authentication (MFA)** — TOTP-based 2FA with authenticator apps
- **Session management** — Track active sessions, allow users to revoke specific sessions
- **Role-based access control (RBAC)** — Granular permissions beyond simple roles
- **Account lockout** — Lock account after N failed login attempts
- **Token blacklisting** — Redis-backed blacklist for revoked tokens before expiry
- **Audit logging** — Track login attempts, password changes, and suspicious activity
- **Rate limiting on auth endpoints** — Separate stricter limits on login/register to prevent brute force
- **Password strength enforcement** — Configurable password policies (uppercase, numbers, special chars)
- **User management API** — Admin endpoints for listing, deactivating, and managing users
