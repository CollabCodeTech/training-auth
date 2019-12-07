import { InternalServerError, UnauthorizedError } from 'restify-errors';

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

const confirmationEmail = async ({ body }, res) => {
  try {
    const { token } = body;
    const { email } = jwt.decode(token);
    await User.updateOne({ email }, { $set: { emailConfirmed: true } });

    return res.send(200, { email });
  } catch (error) {
    const { name } = error;
    const errors = {
      TokenExpiredError: 'O token que você informou expirou',
      JsonWebTokenError: 'O token que você informou é inválido'
    };

    if (errors[error.name]) {
      return res.send(
        new UnauthorizedError({
          toJSON: () => ({
            error: errors[name]
          })
        })
      );
    }

    return res.send(500, error);
  }
};

export { save, confirmationEmail };
