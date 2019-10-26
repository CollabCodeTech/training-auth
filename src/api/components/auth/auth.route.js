export default (server, prefix) => {
  server.post(`${prefix}/auth/login`, (req, res) => res.send({ status: 'ok' }));
};
