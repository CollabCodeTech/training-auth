const validation = (req, res, next) => {
  if (!req.body) {
    return res.send(400, { error: 'User not found' });
  }

  return next();
};

// eslint-disable-next-line import/prefer-default-export
export { validation };
