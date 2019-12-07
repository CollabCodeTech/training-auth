import user from './components/user/user.route';
import auth from './components/auth/auth.route';

export default server => {
  const prefix = '/api';

  user(server, prefix);
  auth(server, prefix);
};
