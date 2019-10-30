import request from 'supertest';
import { expect } from 'chai';

import server from '../../src/api/server';
import User from '../../src/api/components/user/user.model';

const prefix = '/api';

const newUser = {
  name: 'Marco Antonio Bruno da Silva',
  email: 'marco.bruno.br@gmail.com',
  password: 'q1w2e3r4',
};

describe(`${prefix}/auth/login`, () => {
  before(async () => {
    await User.deleteMany();

    await User.create(newUser);
  });

  after(async () => {
    await User.deleteMany();
  });

  describe('POST /', () => {
    // it('should return status 400 without user', async () => {
    //   const { status } = await request(server).post(`${prefix}/auth/login`);

    //   expect(status).to.equal(400);
    // });

    it('should return status 200 with valid user and login', async () => {
      const { status } = await request(server)
        .post(`${prefix}/auth/login`)
        .send({
          email: newUser.email,
          password: newUser.password,
        });

      expect(status).to.equal(200);
    });

    it('should return a token', async () => {
      const { body } = await request(server)
        .post(`${prefix}/auth/login`)
        .send({
          email: newUser.email,
          password: newUser.password,
        });

      expect(body).to.have.property('token');
    });
  });
});
