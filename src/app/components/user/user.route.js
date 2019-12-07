import { hasBodyToSave, hasBodyToConfirmation } from './user.middleware';
import { save, confirmationEmail } from './user.controller';

export default (server, prefix) => {
  server.post(
    `${prefix}/user/confirmation`,
    hasBodyToConfirmation,
    confirmationEmail
  );
  server.post(`${prefix}/user`, hasBodyToSave, save);
};
