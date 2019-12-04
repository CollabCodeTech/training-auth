import { InternalServerError } from 'restify-errors';

import User from './user.model';
import { sendUserConfirmationEmail } from '../../../lib/apis.lib';

const save = async ({ body }, res) => {
  try {
    const user = await User.create(body);

    user.password = undefined;

    await sendUserConfirmationEmail(body.email);

    return res.send(201, user);
  } catch (error) {
    return res.send(new InternalServerError({ cause: error }));
  }
};

// eslint-disable-next-line import/prefer-default-export
export { save };
