import bcrypt from 'bcrypt';

const login = async ({ body: { password } }, res) => {
  try {
    const { user } = res.locals;
    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.send(401, { error: 'Senha inválida' });

    return res.send(200, { token: 'ok' });
  } catch (error) {
    return res.send(500, error);
  }
};

// eslint-disable-next-line import/prefer-default-export
export { login };
