export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
export const AGENT_SERVICE_URL =
  process.env.AGENT_SERVICE_URL || 'http://localhost:4002';
export const RATE_LIMIT_WINDOW_MS =
  parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000;
export const RATE_LIMIT_MAX_REQUESTS =
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100;
