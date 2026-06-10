import { AUTH_SERVICE_URL } from '../config/env.js';

/**
 * Verifies the JWT token by calling AuthMS internally.
 * On success, injects x-user-id and x-user-roles headers
 * into the request for downstream services.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @param {import('express').NextFunction} next - Next middleware
 * @returns {Promise<void>} Resolves after auth check
 */
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.',
      });
    }

    const data = await response.json();

    // Inject user context for downstream services
    req.headers['x-user-id'] = data.userId;
    req.headers['x-user-roles'] = data.roles?.join(',') || 'user';

    next();
  } catch (error) {
    console.error('[Gateway] Auth verification failed:', error.message);

    return res.status(503).json({
      success: false,
      message: 'Authentication service unavailable.',
    });
  }
}

export default authMiddleware;
