import { expect } from 'chai';
import { UserBuilder } from '../data-builders';
import { sendUserConfirmationEmail } from '../../src/lib/apis.lib';

describe('apis.lib', () => {
  describe('#sendUserConfirmationEmail(email)', () => {
    it('should return status 200 when sended email in parameter', async () => {
      const { email } = UserBuilder.emailValid();

      const res = await sendUserConfirmationEmail(email);

      expect(res.status).to.equal(200);
    });
  });
});
