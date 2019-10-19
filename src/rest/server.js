import { config } from 'dotenv';
import mongoose from 'mongoose';
import restify from 'restify';
import helmet from 'helmet';
import morgan from 'morgan';
import winston from 'winston';

import routes from './routes';

config();

const server = restify.createServer();
const { MONGO_URI } = process.env;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

server.use(helmet());
server.use(morgan('combined', { stream: winston.stream.write }));

routes(server);

export default server;
