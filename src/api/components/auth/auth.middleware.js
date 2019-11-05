import User from '../user/user.model';

const hasBody = (req, res, next) => {
  if (!req.body) {
    return res.send(400, {
      field: 'email',
      error: 'Email e senha não informados',
    });
  }

  return next();
};

const loadUser = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.send(401, { field: 'email', error: 'Email não cadastrado' });
  }

  res.locals = { user };
  return next();
};

export { hasBody, loadUser };
