const validation = (req, res, next) => {
  if (!req.body) {
    return res.send(400, { error: 'Usuário não foi informado' });
  }

  return next();
};

// eslint-disable-next-line import/prefer-default-export
export { validation };
