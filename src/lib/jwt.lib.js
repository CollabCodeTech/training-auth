import { readFileSync } from 'fs';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();

const { ALGORITHM, AUTH_PRIVATE_KEY_PATH, AUTH_PUBLIC_KEY_PATH } = process.env;
const filePrivateKey = readFileSync(AUTH_PRIVATE_KEY_PATH);
const filePublicKey = readFileSync(AUTH_PUBLIC_KEY_PATH);

const sign = (data, jwtOptions = {}) => {
  const token = jwt.sign(data, filePrivateKey, {
    ...jwtOptions,
    algorithm: ALGORITHM
  });

  return token;
};

const encode = (data, options = {}) => {
  const token = sign(data, options);

  return token;
};

const decode = token => {
  const data = jwt.verify(token, filePublicKey, { algorithms: [ALGORITHM] });

  return data;
};

const refresh = (token, options = {}) => {
  const data = decode(token);

  delete data.iat;
  delete data.exp;

  return encode(data, options);
};

export default { encode, decode, refresh };
