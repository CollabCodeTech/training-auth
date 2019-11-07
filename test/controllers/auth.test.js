import request from 'supertest';
import { expect } from 'chai';

import server from '../../src/api/server';
import User from '../../src/api/components/user/user.model';

const path = '/api/auth/login';

const newUser = {
  name: 'Marco Antonio Bruno da Silva',
  email: 'marco.bruno.br@gmail.com',
  password: 'q1w2e3r4',
};

after(() => User.db.close());

describe(path, () => {
  before(async () => {
    await User.deleteMany();

    await User.create(newUser);
  });

  after(async () => {
    await User.deleteMany();
  });

  describe('POST /', () => {
    it('should return status 400 and JSON error without email and password', async () => {
      const { status, body } = await request(server).post(path);

      expect(status).to.equal(400);
      expect(body).to.have.property('field');
      expect(body).to.have.property('error');
    });

    it('should return status 401 and JSON error when email does not exist', async () => {
      const { status, body } = await request(server)
        .post(path)
        .send({ email: 'marco@gmail.com', password: 'ah98sh98sa89s' });

      expect(status).to.equal(401);
      expect(body).to.have.property('error');
    });

    it('should return status 401 and JSON error when the not equal password', async () => {
      const { status, body } = await request(server)
        .post(path)
        .send({
          email: newUser.email,
          password: 'asada898ad98',
        });

      expect(status).to.equal(401);
      expect(body).to.have.property('error');
    });

    it('should return status 200 with valid user and login', async () => {
      const { status } = await request(server)
        .post(path)
        .send({
          email: newUser.email,
          password: newUser.password,
        });

      expect(status).to.equal(200);
    });

    it('should return json with msg and name', async () => {
      const { body } = await request(server)
        .post(path)
        .send({ email: newUser.email, password: newUser.password });

      expect(body).to.have.property('msg');
      expect(body).to.have.property('name');
    });

    it('shuld return set-cookie and JWT', async () => {
      const { headers } = await request(server)
        .post(path)
        .send({
          email: newUser.email,
          password: newUser.password,
        });

      const cookies = headers['set-cookie'][0];

      expect(headers).to.have.property('set-cookie');
      expect(cookies).to.be.a('string');
      expect(cookies).to.match(/jwt=/);
    });

    it('should have Set-Cookie with SameSite=Strict; Secure and HttpOnly', async () => {
      const { headers } = await request(server)
        .post(path)
        .send({
          email: newUser.email,
          password: newUser.password,
        });
      const cookies = headers['set-cookie'][0];

      expect(headers).to.have.property('set-cookie');
      expect(cookies).to.be.a('string');
      expect(cookies).to.match(/SameSite=Strict/);
      expect(cookies).to.match(/Secure/);
      expect(cookies).to.match(/HttpOnly/);
    });
  });
});
