import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

// Middlewares
import errorHandler from './middleware/errorHandler.js';
// Routes
import agentRoutes from './routes/agent.js';
import healthRoutes from './routes/health.js';

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(cors());

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// Health check (no auth required)
app.use('/health', healthRoutes);

// Require x-user-id header for all agent routes (set by gateway after auth)
app.use(
  '/api/agents',
  (req, res, next) => {
    if (!req.headers['x-user-id']) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Missing user context.',
      });
    }
    next();
  },
  agentRoutes,
);

// Error handling
app.use(errorHandler);

export default app;
