import { config } from 'dotenv';
import superagent from 'superagent';

config();
const { HOST, PORT, HOST_API_EMAIL } = process.env;

async function sendUserConfirmationEmail(email, token) {
  const url = `${HOST_API_EMAIL}/user/confirmation`;
  const contentLink = `${HOST}:${PORT}/user/confirmation`;
  const link = `${contentLink}/${token}`;
  const res = await superagent.post(url).send({
    email,
    contentLink,
    link
  });

  return res;
}

// eslint-disable-next-line import/prefer-default-export
export { sendUserConfirmationEmail };
