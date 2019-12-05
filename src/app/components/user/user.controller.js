import { InternalServerError } from 'restify-errors';

import User from './user.model';
import jwt from '../../../lib/jwt.lib';
import { sendUserConfirmationEmail } from '../../../lib/apis.lib';

const save = async ({ body }, res) => {
  try {
    const { email } = await User.create(body);

    const token = jwt.encode({ email }, { expiresIn: '1h' });
    await sendUserConfirmationEmail(email, token);

    return res.send(201, { email });
  } catch (error) {
    return res.send(new InternalServerError({ cause: error }));
  }
};

// eslint-disable-next-line import/prefer-default-export
export { save };
