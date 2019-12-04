import { expect } from 'chai';

import User from '../../../../src/app/components/user/user.model';

import UserBuilder from '../../../data-builders/user.builder';

describe('User model', () => {
  describe('when creating a new user', () => {
    let userInfo;
    beforeEach(async () => {
      await User.deleteMany();

      userInfo = UserBuilder.randomUserInfo();
    });

    it('should store password encrypted', async () => {
      const newUser = await User.create(userInfo);

      expect(newUser.password).to.not.be.equal(userInfo.password);
      expect(newUser.password.length).to.be.equal(60);
    });
  });

  describe('when updating an existing user', () => {
    let user = {};
    beforeEach(async () => {
      await User.deleteMany();

      user = await UserBuilder.createOne();
    });

    it("shouldn't re-encrypt password if it didn't change", async () => {
      const oldEncryptedPassword = `${user.password}`;

      user.name = 'Some Other Name';
      const updatedUser = await user.save();

      expect(updatedUser.password).to.be.equal(oldEncryptedPassword);
    });
  });
});
