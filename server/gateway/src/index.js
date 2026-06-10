import 'dotenv/config';

import { PORT } from './config/env.js';
import app from './app.js';

app.listen(PORT, () => {
  console.log(
    `[Gateway] Running on port ${PORT} in ${process.env.NODE_ENV} mode`,
  );
});
