import jwt from 'jsonwebtoken';

import {
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_SECRET,
} from '../config/env.js';
import UserModel from '../models/user.js';

/**
 * Controller handling authentication endpoints
 * with integrated service logic.
 */
class AuthController {
  /**
   * Register a new user account.
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   * @param {import('express').NextFunction} next - Next middleware
   * @returns {Promise<void>}
   */
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use',
        });
      }

      const user = await UserModel.create({
        name,
        email,
        password,
      });
      const tokens = this.generateTokens(user);

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
          },
          ...tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login with email and password.
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   * @param {import('express').NextFunction} next - Next middleware
   * @returns {Promise<void>}
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email }).select('+password');

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated',
        });
      }

      const tokens = this.generateTokens(user);

      res.status(200).json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles,
          },
          ...tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify a JWT token (internal endpoint for gateway).
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   * @param {import('express').NextFunction} next - Next middleware
   * @returns {Promise<void>}
   */
  async verify(req, res, next) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token is required',
        });
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET);

        res.status(200).json({
          success: true,
          valid: true,
          userId: decoded.userId,
          roles: decoded.roles,
        });
      } catch (jwtError) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token',
        });
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token using a valid refresh token.
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   * @param {import('express').NextFunction} next - Next middleware
   * @returns {Promise<void>}
   */
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required',
        });
      }

      let decoded;

      try {
        decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      } catch (jwtError) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
        });
      }

      const user = await UserModel.findById(decoded.userId);

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
        });
      }

      const tokens = this.generateTokens(user);

      res.status(200).json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get the authenticated user's profile.
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   * @param {import('express').NextFunction} next - Next middleware
   * @returns {Promise<void>}
   */
  async me(req, res, next) {
    try {
      const user = await UserModel.findById(req.headers['x-user-id']);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'UserModel not found',
        });
      }

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          roles: user.roles,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate access and refresh tokens for a user.
   * @param {object} user - Mongoose user document
   * @returns {object} Object with accessToken and refreshToken
   */
  generateTokens(user) {
    const accessToken = jwt.sign(
      { userId: user._id, roles: user.roles },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }
}

export default new AuthController();
