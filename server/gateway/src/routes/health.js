import { Router } from 'express';

const router = Router();

/**
 * Health check endpoint for the gateway.
 * Returns service status, uptime, and timestamp.
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 * @returns {void}
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'gateway',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
