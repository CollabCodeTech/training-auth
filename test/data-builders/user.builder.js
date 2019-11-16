import faker from 'faker';

import User from '../../src/api/components/user/user.model';

const generateName = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  return `${firstName} ${lastName}`;
};

const randomUserInfo = (options = {}) => {
  const blank = {};

  return Object.assign(
    blank,
    {
      name: generateName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
    { ...options },
  );
};

const createOne = (options) => User.create(randomUserInfo(options));

const emailInvalid = () => ({ email: faker.lorem.word() });

export default { randomUserInfo, createOne, emailInvalid };
