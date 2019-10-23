import user from './components/user/user.route';

export default (server) => {
  const prefix = '/api';

  user(server, prefix);
};
