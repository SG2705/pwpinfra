import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

// Middlewares
import errorHandler from './middleware/errorHandler.js';
import rateLimiter from './middleware/rateLimiter.js';
// Routes
import healthRoutes from './routes/health.js';
import proxyRoutes from './routes/proxy.js';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Logging
app.use(morgan('combined'));

// Rate limiting
app.use(rateLimiter);

// Health check
app.use('/health', healthRoutes);

// Proxy routes to microservices
app.use('/', proxyRoutes);

// Error handling
app.use(errorHandler);

export default app;
