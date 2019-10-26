import request from 'supertest';
import { expect } from 'chai';

import server from '../../src/api/server';
import User from '../../src/api/components/user/user.model';

const prefix = '/api';

describe(`${prefix}/auth`, () => {
  before(() => User.deleteMany());
  after(() => User.deleteMany());

  describe('POST /', () => {
    it('should return status 200', async () => {
      const { status } = await request(server).post(`${prefix}/auth/login`);

      expect(status).to.equal(200);
    });

    it('should return a token', async () => {
      const newUser = {
        name: 'Marco Antonio Bruno da Silva',
        email: 'marco.bruno.br@gmail.com',
        password: 'q1w2e3r4',
      };

      await User.create(newUser);

      const { body } = await request(server).post(`${prefix}/auth/login`);

      expect(body).to.have.property('token');
    });
  });
});
