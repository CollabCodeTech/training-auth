import User from '../user/user.model';

const validation = async (req, res, next) => {
  if (!req.body) {
    return res.send(400, { error: 'Usuário não foi informado' });
  }

  const { email } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.send(401, { error: 'Email não cadastro' });
  }

  res.locals = { user };
  return next();
};

// eslint-disable-next-line import/prefer-default-export
export { validation };
