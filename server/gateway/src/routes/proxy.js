import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import services from '../config/services.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

// Auth service — public (no auth middleware)
router.use(
  services.auth.prefix,
  createProxyMiddleware({
    target: services.auth.url,
    changeOrigin: true,
    pathRewrite: { [`^${services.auth.prefix}`]: '/api/auth' },
  }),
);

// Agent service — protected (requires valid token)
router.use(
  services.agent.prefix,
  authMiddleware,
  createProxyMiddleware({
    target: services.agent.url,
    changeOrigin: true,
    pathRewrite: { [`^${services.agent.prefix}`]: '/api/agents' },
  }),
);

export default router;
