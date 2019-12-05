import { InternalServerError } from 'restify-errors';

import User from './user.model';
import { sendUserConfirmationEmail } from '../../../lib/apis.lib';

const save = async ({ body }, res) => {
  try {
    const { email } = await User.create(body);

    await sendUserConfirmationEmail(email);

    return res.send(201, email);
  } catch (error) {
    return res.send(new InternalServerError({ cause: error }));
  }
};

// eslint-disable-next-line import/prefer-default-export
export { save };
