import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

// Middlewares
import errorHandler from './middleware/errorHandler.js';
// Routes
import authRoutes from './routes/auth.js';
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

// Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);

// Error handling
app.use(errorHandler);

export default app;
