import { readFileSync } from 'fs';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();

const { ALGORITHM, AUTH_PRIVATE_KEY_PATH } = process.env;
const filePrivateKey = readFileSync(AUTH_PRIVATE_KEY_PATH);

const sign = (data, jwtOptions = {}) => {
  const token = jwt.sign(data, filePrivateKey, {
    ...jwtOptions,
    algorithm: ALGORITHM,
  });

  return token;
};

const encode = (data, options = {}) => {
  const token = sign(data, options);

  return token;
};

// eslint-disable-next-line import/prefer-default-export
export default { encode };
