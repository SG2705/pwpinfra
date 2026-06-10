import AgentModel from '../models/agent.js';

/**
 * Controller handling agent HTTP endpoints
 * with integrated service logic.
 * All queries are scoped to the authenticated user.
 */
class AgentController {
  /**
   * Create a new agent.
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   * @param {import('express').NextFunction} next - Next middleware
   * @returns {Promise<void>}
   */
  async create(req, res, next) {
    try {
      const userId = req.headers['x-user-id'];
      const { name, description, config } = req.body;

      const agent = await AgentModel.create({
        name,
        description,
        config,
        createdBy: userId,
      });

      res.status(201).json({ success: true, data: agent });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all agents for the authenticated user.
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   * @param {import('express').NextFunction} next - Next middleware
   * @returns {Promise<void>}
   */
  async getAll(req, res, next) {
    try {
      const userId = req.headers['x-user-id'];
      const { page, limit, status } = req.query;

      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 20;
      const skip = (pageNum - 1) * limitNum;

      const query = { createdBy: userId };

      if (status) query.status = status;

      const [agents, total] = await Promise.all([
        AgentModel.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum),
        AgentModel.countDocuments(query),
      ]);

      res.status(200).json({
        success: true,
        data: {
          agents,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single agent by ID.
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   * @param {import('express').NextFunction} next - Next middleware
   * @returns {Promise<void>}
   */
  async getById(req, res, next) {
    try {
      const userId = req.headers['x-user-id'];
      const agent = await AgentModel.findOne({
        _id: req.params.id,
        createdBy: userId,
      });

      if (!agent) {
        return res.status(404).json({
          success: false,
          message: 'AgentModel not found',
        });
      }

      res.status(200).json({ success: true, data: agent });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an existing agent.
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   * @param {import('express').NextFunction} next - Next middleware
   * @returns {Promise<void>}
   */
  async update(req, res, next) {
    try {
      const userId = req.headers['x-user-id'];
      const agent = await AgentModel.findOneAndUpdate(
        { _id: req.params.id, createdBy: userId },
        { $set: req.body },
        { new: true, runValidators: true },
      );

      if (!agent) {
        return res.status(404).json({
          success: false,
          message: 'AgentModel not found',
        });
      }

      res.status(200).json({ success: true, data: agent });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Archive (soft-delete) an agent.
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   * @param {import('express').NextFunction} next - Next middleware
   * @returns {Promise<void>}
   */
  async delete(req, res, next) {
    try {
      const userId = req.headers['x-user-id'];
      const agent = await AgentModel.findOneAndUpdate(
        { _id: req.params.id, createdBy: userId },
        { $set: { status: 'archived' } },
        { new: true },
      );

      if (!agent) {
        return res.status(404).json({
          success: false,
          message: 'AgentModel not found',
        });
      }

      res.status(200).json({ success: true, data: agent });
    } catch (error) {
      next(error);
    }
  }
}

export default new AgentController();
