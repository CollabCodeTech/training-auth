import { hasBody, loadUser } from './auth.middleware';
import { login } from './auth.controller';

export default (server, prefix) => {
  server.post(`${prefix}/auth/login`, hasBody, loadUser, login);
};
