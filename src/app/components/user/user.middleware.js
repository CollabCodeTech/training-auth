import { ConflictError, BadRequestError } from 'restify-errors';
import * as yup from 'yup';

import User from './user.model';

yup.setLocale({
  mixed: {
    required: 'Campo obrigatório'
  },
  string: {
    email: 'Por favor, preencha com email válido',
    min: ({ min }) => `Use no mínimo ${min} caracteres`
  }
});

const schema = yup.object().shape({
  name: yup
    .string()
    .min(2)
    .required(),
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .min(8)
    .required()
});

const userAlreadyExists = user => !!user.length;

const hasBodyToSave = ({ body }, res, next) => {
  schema
    .validate(body, { abortEarly: false })
    .then(async () => {
      const user = await User.find({ email: body.email });

      if (userAlreadyExists(user)) {
        return res.send(
          new ConflictError({
            toJSON: () => [{ field: 'email', error: 'Email já cadastrado' }]
          })
        );
      }

      return next();
    })
    .catch(error => {
      const msgError = error.inner.map(({ path, message }) => ({
        field: path,
        error: message
      }));

      res.send(new BadRequestError({ toJSON: () => msgError }));
    });
};

const hasBodyToConfirmation = ({ body }, res, next) => {
  if (!body) {
    return res.send(
      new BadRequestError({
        toJSON: () => ({
          error: 'Não foi enviado um token no body'
        })
      })
    );
  }

  return next();
};

export { hasBodyToSave, hasBodyToConfirmation };
