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

const hasCookieJwt = ({ headers: { cookie } }, res, next) => {
  if (/jwt/.test(cookie)) {
    return next();
  }

  return res.send(401, { msg: 'Faltando o jwt no cookie' });
};

export { hasBody, loadUser, hasCookieJwt };
