import restify from 'restify';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import winston from 'winston';
import logger from './config/winston';

dotenv.config();

const app = restify.createServer();
const { PORT } = process.env;

app.use(helmet());
app.use(morgan('combined', { stream: winston.stream }));

app.get('/', (req, res) => res.send({ hello: 'world' }));

app.listen(PORT, () => {
  logger.silly();
  logger.info(`Listening at http://localhost:${PORT}`);
  logger.info('Turn off server: ctrl + c');
});
