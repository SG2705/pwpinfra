/**
 * Global error handler for the gateway.
 * Catches all unhandled errors and returns a JSON response.
 * @param {Error} err - The error object
 * @param {import('express').Request} _req - Express request
 * @param {import('express').Response} res - Express response
 * @returns {void}
 */
export default function errorHandler(err, _req, res) {
  console.error('[Gateway] Error:', err.message);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(statusCode).json({
    success: false,
    message,
  });
}
