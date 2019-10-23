import { config } from 'dotenv';
import mongoose from 'mongoose';

import logger from './winston';

export default () => {
  config();
  const { MONGO_URI } = process.env;

  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => logger.info(`Connect to MongoDB at ${MONGO_URI}`))
    .catch((error) => {
      logger.error('Failed to connect to MongoDB...', error);
      process.exit();
    });
};
