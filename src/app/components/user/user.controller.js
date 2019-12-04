import superagent from 'superagent';
import { InternalServerError } from 'restify-errors';

import User from './user.model';

const save = async ({ body }, res) => {
  try {
    const user = await User.create(body);

    user.password = undefined;

    await superagent.post('http://localhost:5002/user/confirmation').send({
      email: body.email,
      link: 'http://localhost:5001/user/confirmation'
    });

    return res.send(201, user);
  } catch (error) {
    return res.send(new InternalServerError({ cause: error }));
  }
};

// eslint-disable-next-line import/prefer-default-export
export { save };
