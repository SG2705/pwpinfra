const NODE_ENV = process.env.NODE_ENV || 'development';

// Prevent startup with default secrets in production
if (NODE_ENV === 'production') {
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'MONGO_URI'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(
      `[AuthMS] FATAL: Missing required env vars in production: ${missing.join(', ')}`,
    );

    process.exit(1);
  }
}

export const PORT = process.env.PORT || 4001;
export { NODE_ENV };
export const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/auth_db';
export const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
export const JWT_REFRESH_EXPIRES_IN =
  process.env.JWT_REFRESH_EXPIRES_IN || '30d';
