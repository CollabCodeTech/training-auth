import { config } from 'dotenv';
import superagent from 'superagent';

config();
const { HOST, PORT, API_EMAIL } = process.env;

async function sendUserConfirmationEmail(email) {
  const url = `${API_EMAIL}/user/confirmation`;
  const link = `${HOST}:${PORT}/user/confirmation`;
  const res = await superagent.post(url).send({
    email,
    link
  });

  return res;
}

// eslint-disable-next-line import/prefer-default-export
export { sendUserConfirmationEmail };
