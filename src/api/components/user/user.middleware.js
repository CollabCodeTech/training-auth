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
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

const hasBody = ({ body }, res, next) => {
  schema.validate(body, { abortEarly: false }).then(() => next()).catch((error) => {
    res.send(400);
  });
};


// eslint-disable-next-line import/prefer-default-export
export { hasBody };
