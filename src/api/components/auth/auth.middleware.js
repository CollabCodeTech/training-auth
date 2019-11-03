import { BadRequestError, UnauthorizedError } from 'restify-errors';

import User from '../user/user.model';

const hasBody = (req, res, next) => {
  if (!req.body) {
    return res.send(new BadRequestError('Usuário não foi informado'));
  }

  return next();
};

const loadUser = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.send(new UnauthorizedError('Email não cadastrado'));
  }

  res.locals = { user };
  return next();
};

export { hasBody, loadUser };
