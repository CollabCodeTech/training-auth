import { config } from 'dotenv';
import superagent from 'superagent';

config();
const { API_EMAIL } = process.env;

async function sendUserConfirmationEmail(email) {
  const url = `${API_EMAIL}/user/confirmation`;

  const res = await superagent.post(url).send({
    email,
    link: 'http://localhost:5001/user/confirmation'
  });

  return res;
}

// eslint-disable-next-line import/prefer-default-export
export { sendUserConfirmationEmail };
