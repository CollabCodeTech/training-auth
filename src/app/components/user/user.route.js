import { hasBody } from './user.middleware';
import { save } from './user.controller';

export default (server, prefix) => {
  server.post(`${prefix}/users`, hasBody, save);
};
