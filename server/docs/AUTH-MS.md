# AuthMS — Authentication Service

## Purpose

AuthMS is responsible for **user identity management**.
It handles registration, login, token issuance, token
verification, and token refresh. It is the single source
of truth for "who is this user?"

## Port

`4001`

## Responsibilities

| Responsibility     | Description                            |
| ------------------ | -------------------------------------- |
| User Registration  | Create accounts with hashed passwords  |
| Login              | Validate credentials, issue JWT tokens |
| Token Verification | Validate tokens (called by gateway)    |
| Token Refresh      | Issue new access tokens                |
| User Profile       | Return authenticated user's data       |

## API Endpoints

| Method | Path                 | Access    | Description   |
| ------ | -------------------- | --------- | ------------- |
| POST   | `/api/auth/register` | Public    | Register user |
| POST   | `/api/auth/login`    | Public    | Login         |
| POST   | `/api/auth/verify`   | Internal  | Verify token  |
| POST   | `/api/auth/refresh`  | Public    | Refresh token |
| GET    | `/api/auth/me`       | Protected | User profile  |
| GET    | `/health`            | Public    | Health check  |

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
{ "token": "eyJhbGciOiJIUzI1NiIs..." }

// Response (200)
{
  "success": true,
  "valid": true,
  "userId": "6750a1b2c3d4e5f6a7b8c9d0",
  "roles": ["user"]
}
```

## Data Model — User

| Field       | Type     | Description                  |
| ----------- | -------- | ---------------------------- |
| `_id`       | ObjectId | Auto-generated ID            |
| `name`      | String   | Full name (max 100 chars)    |
| `email`     | String   | Unique, lowercase, trimmed   |
| `password`  | String   | bcrypt hashed, select: false |
| `roles`     | [String] | `user` or `admin`            |
| `isActive`  | Boolean  | Soft deactivation flag       |
| `createdAt` | Date     | Auto-generated               |
| `updatedAt` | Date     | Auto-generated               |

## Security Measures

- Passwords hashed with **bcrypt** (12 salt rounds)
- Password field excluded from queries by default
- JWT signed with separate access and refresh secrets
- Input validation on all endpoints (express-validator)
- Request body size limited to 10KB
- Deactivated accounts cannot login
- Production startup blocked without proper secrets

## Token Strategy

| Token   | Secret               | Expiry | Purpose            |
| ------- | -------------------- | ------ | ------------------ |
| Access  | `JWT_SECRET`         | 7d     | Authorize requests |
| Refresh | `JWT_REFRESH_SECRET` | 30d    | Get new tokens     |

## Directory Structure

```
auth-ms/
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
    │   └── auth.js           ← Auth logic + HTTP layer
    ├── models/
    │   └── user.js           ← Mongoose User schema
    ├── routes/
    │   ├── auth.js           ← Auth route definitions
    │   └── health.js         ← Health check
    ├── middleware/
    │   ├── errorHandler.js   ← Global error handler
    │   └── validate.js       ← Validation middleware
    └── validators/
        ├── register.js       ← Register input rules
        └── login.js          ← Login input rules
```

## Database

- **Database name:** `auth_db`
- **Collection:** `users`
- **Indexes:** `email` (unique)

## Future Enhancements

- Email verification on registration
- Password reset flow with time-limited tokens
- OAuth2 / Social login (Google, GitHub)
- Multi-factor authentication (TOTP-based 2FA)
- Session management and token blacklisting
- Account lockout after failed attempts
- Audit logging for login attempts
- Admin user management endpoints
