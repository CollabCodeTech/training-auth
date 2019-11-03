import bcrypt from 'bcrypt';
import { UnauthorizedError, InternalServerError } from 'restify-errors';

import Jwt from '../../../lib/Jwt.lib';

const setCookieJwt = (res, jwt) => {
  res.header('Set-Cookie', `jwt=${jwt}; SameSite=Strict; Secure; HttpOnly`);
};

const login = async ({ body: { password } }, res) => {
  try {
    const { user } = res.locals;
    const match = await bcrypt.compare(password, user.password);

    if (!match) res.send(new UnauthorizedError('Senha inválida'));

    const jwt = Jwt.encode({ name: user.name });

    setCookieJwt(res, jwt);

    return res.send(200, { jwt });
  } catch (error) {
    return res.send(new InternalServerError({ cause: error }));
  }
};

// eslint-disable-next-line import/prefer-default-export
export { login };
