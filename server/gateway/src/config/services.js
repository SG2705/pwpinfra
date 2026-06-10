import { AGENT_SERVICE_URL, AUTH_SERVICE_URL } from './env.js';

/**
 * Service registry — maps route prefixes to internal service URLs.
 * Add new services here as the system grows.
 */
const services = {
  auth: {
    url: AUTH_SERVICE_URL,
    prefix: '/api/auth',
    isProtected: false,
  },
  agent: {
    url: AGENT_SERVICE_URL,
    prefix: '/api/agents',
    isProtected: true,
  },
};

export default services;
