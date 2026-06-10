import 'dotenv/config';

import connectDB from './config/db.js';
import { PORT } from './config/env.js';
import app from './app.js';

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `[AgentMS] Running on port ${PORT} in ${process.env.NODE_ENV} mode`,
    );
  });
};

start();
