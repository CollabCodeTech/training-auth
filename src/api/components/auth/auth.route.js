import { login } from './auth.controller';

export default (server, prefix) => {
  server.post(`${prefix}/auth/login`, login);
};
