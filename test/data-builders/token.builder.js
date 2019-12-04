import faker from 'faker';
import jwt from 'jsonwebtoken';

const generateRandom = (data = {}) =>
  jwt.sign(
    data,
    faker.lorem
      .sentence()
      .split(' ')
      .join('')
  );

export default { generateRandom };
