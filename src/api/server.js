import { config } from 'dotenv';
import restify from 'restify';
import helmet from 'helmet';
import morgan from 'morgan';
import winston from 'winston';
import corsMiddleware from 'restify-cors-middleware';

import database from '../config/database';
import routes from './routes';

config();

const server = restify.createServer();

database();

const { CORS } = process.env;

const cors = corsMiddleware({
  origins: [CORS],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry'],
});

server.pre(cors.preflight);

server.use(cors.actual);
server.use(helmet());
server.use(
  morgan('combined', {
    stream: winston.stream.write,
    // Skip request logging when running the tests
    skip: () => process.env.NODE_ENV === 'test',
  })
);
server.use(restify.plugins.bodyParser());

routes(server);

export default server;
