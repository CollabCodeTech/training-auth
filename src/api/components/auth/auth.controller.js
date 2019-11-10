import bcrypt from 'bcrypt';

import Jwt from '../../../lib/Jwt.lib';

const setCookieJwt = (res, jwt) => {
  const { COOKIE_OPTIONS } = process.env;

  res.header('Set-Cookie', `jwt=${jwt}; ${COOKIE_OPTIONS}`);
};

const login = async ({ body: { password } }, res) => {
  try {
    const { user } = res.locals;
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.send(401, { field: 'password', error: 'Senha inválida' });
    }

    const jwt = Jwt.encode({ name: user.name }, { expiresIn: '1day' });

    setCookieJwt(res, jwt);

    return res.send(200, {
      msg: 'Login efeturado com sucesso!',
      name: user.name,
    });
  } catch (error) {
    return res.send(500, error);
  }
};

const refreshToken = ({ headers: { cookie } }, res) => {
  try {
    const jwt = cookie.match(/jwt=([^;]+)/)[1];
    const newJwt = Jwt.refresh(jwt);

    setCookieJwt(res, newJwt);

    return res.send(200, {
      msg: 'Token atualizado com sucesso',
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.send(401, { msg: 'Token expirou' });
    }

    return res.send(500, error);
  }
};

export { login, refreshToken };
