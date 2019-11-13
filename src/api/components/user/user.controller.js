import { InternalServerError } from 'restify-errors';

import User from './user.model';

const getAll = async (req, res) => {
  try {
    const users = await User.find();

    return res.send(200, users);
  } catch (error) {
    return res.send(new InternalServerError({ cause: error }));
  }
};

const save = async ({ body }, res) => {
  try {
    const user = await User.create(body);

    user.password = undefined;

    return res.send(201, user);
  } catch (error) {
    return res.send(new InternalServerError({ cause: error }));
  }
};

export { getAll, save };
