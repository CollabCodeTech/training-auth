import bcrypt from 'bcrypt';

import Jwt from '../../../lib/Jwt.lib';

const setCookieJwt = (res, jwt) => {
  res.header('Set-Cookie', `jwt=${jwt}; SameSite=Strict; Secure; HttpOnly`);
};

const login = async ({ body: { password } }, res) => {
  try {
    const { user } = res.locals;
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.send(401, { field: 'password', error: 'Senha inválida' });
    }

    const jwt = Jwt.encode({ name: user.name });

    setCookieJwt(res, jwt);

    return res.send(200, {
      msg: 'Login efeturado com sucesso!',
      name: user.name,
    });
  } catch (error) {
    return res.send(500, error);
  }
};

// eslint-disable-next-line import/prefer-default-export
export { login };
