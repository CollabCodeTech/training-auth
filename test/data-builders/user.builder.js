import faker from 'faker';

import User from '../../src/app/components/user/user.model';

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
      password: faker.internet.password()
    },
    { ...options }
  );
};

const createOne = options => User.create(randomUserInfo(options));
const emailInvalid = () => ({ email: faker.lorem.word() });
const passwordInvalid = () => ({ password: faker.internet.password(7) });
const nameInvalid = () => ({ name: faker.internet.password(1) });
const emailValid = () => ({ email: faker.internet.email() });

export default {
  randomUserInfo,
  createOne,
  emailInvalid,
  passwordInvalid,
  nameInvalid,
  emailValid
};
