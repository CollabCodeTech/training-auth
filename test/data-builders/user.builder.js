import faker from 'faker';

import User from '../../src/api/components/user/user.model';

export default class UserBuilder {
  static randomUserInfo(options = {}) {
    const blank = {};

    return Object.assign(
      blank,
      {
        name: this.generateName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
      { ...options },
    );
  }

  static createOne(options) {
    return User.create(this.randomUserInfo(options));
  }

  static generateName() {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    return `${firstName} ${lastName}`;
  }
}
