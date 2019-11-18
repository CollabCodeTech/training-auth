import * as yup from 'yup';

yup.setLocale({
  mixed: {
    required: 'Campo obrigatório',
  },
  string: {
    email: 'Por favor, preencha com email válido',
    min: ({ min }) => `Use no mínimo ${min} caracteres`,
  },
});

const schema = yup.object().shape({
  name: yup.string().min(2).required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

const hasBody = ({ body }, res, next) => {
  schema.validate(body, { abortEarly: false }).then(() => next()).catch((error) => {
    const msgError = error.inner.map(({ path, message }) => ({ field: path, error: message }));

    res.send(400, msgError);
  });
};


// eslint-disable-next-line import/prefer-default-export
export { hasBody };
