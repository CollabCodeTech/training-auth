import { hasBody, loadUser, hasCookieJwt } from './auth.middleware';
import { login, refreshToken } from './auth.controller';

export default (server, prefix) => {
  server.post(`${prefix}/auth/login`, hasBody, loadUser, login);
  server.post(`${prefix}/auth/refresh`, hasCookieJwt, refreshToken);
};
