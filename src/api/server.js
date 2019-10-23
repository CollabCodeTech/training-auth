import restify from 'restify';
import helmet from 'helmet';
import morgan from 'morgan';
import winston from 'winston';

import database from '../config/database';
import routes from './routes';

const server = restify.createServer();

database();

server.use(helmet());
server.use(morgan('combined', { stream: winston.stream.write }));
server.use(restify.plugins.bodyParser());

routes(server);

export default server;
