import { expect } from 'chai';
import { UserBuilder } from '../data-builders';

import jwt from '../../src/lib/jwt.lib';
import { sendUserConfirmationEmail } from '../../src/lib/apis.lib';

describe('apis.lib', () => {
  describe('#sendUserConfirmationEmail(email, token)', () => {
    it('should return status 200 when sended email in parameter', async () => {
      const { email } = UserBuilder.emailValid();
      const token = jwt.encode({ email }, { expiresIn: '1h' });
      const res = await sendUserConfirmationEmail(email, token);

      expect(res.status).to.equal(200);
    });
  });
});
