import { config } from 'dotenv';

import server from './app/server';
import logger from './config/winston';

config();

const { PORT } = process.env;

server.listen(PORT, () => {
  logger.silly();
  logger.info(`Listening at http://localhost:${PORT}`);
  logger.info('Turn off server: ctrl + c');
});
