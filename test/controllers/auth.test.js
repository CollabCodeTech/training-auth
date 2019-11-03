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

    it('should have Set-Cookie and JWT', async () => {
      const { headers } = await request(server)
        .post(path)
        .send({
          email: newUser.email,
          password: newUser.password,
        });

      expect(headers).to.have.property('set-cookie');
      expect(headers['set-cookie']).to.be.a('array');
      expect(headers['set-cookie'][0]).to.be.a('string');
      expect(headers['set-cookie'][0]).to.match(/jwt=([^.]+\.){2}[^.]+;/);
    });

    it('should Set-Cookie have SameSite=Strict; Secure; HttpOnly attribs', async () => {
      const { headers } = await request(server)
        .post(path)
        .send({
          email: newUser.email,
          password: newUser.password,
        });

      const cookie = headers['set-cookie'][0];
      expect(cookie).to.match(/SameSite=Strict/);
      expect(cookie).to.match(/Secure/);
      expect(cookie).to.match(/HttpOnly/);
    });
  });
});
