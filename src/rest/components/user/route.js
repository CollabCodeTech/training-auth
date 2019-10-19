export default (server, prefix) => {
  server.get(`${prefix}/users`, (req, res) => {
    res.send(200, { user: 'Marco' });
  });

  server.post(`${prefix}/users`, (req, res) => {
    res.send(201, {
      name: 'Marco Bruno',
      email: 'marco.bruno.br@gmail.com',
      password: 'q1w2e3r4',
    });
  });
};
