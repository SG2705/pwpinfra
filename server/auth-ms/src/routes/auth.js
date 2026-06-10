import { Router } from 'express';

// Controllers
import authController from '../controllers/auth.js';
// Middlewares
import validate from '../middleware/validate.js';
// Validators
import loginValidator from '../validators/login.js';
import registerValidator from '../validators/register.js';

const router = Router();

// Public routes
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/refresh', authController.refresh);

// Internal route (called by gateway)
router.post('/verify', authController.verify);

// Protected route (user must be authenticated — header set by gateway)
router.get('/me', authController.me);

export default router;
