import request from 'supertest';
import { expect } from 'chai';

import server from '../../src/api/server';

const prefix = '/api';

describe(`${prefix}/users`, () => {
  // after(() => User.deleteMany());

  describe('GET /', () => {
    it('should return all users', async () => {
      const res = await request(server).get(`${prefix}/users`);

      expect(res.status).to.equal(200);
    });
  });

  describe('POST /', () => {
    it('should return user when the all request body is valid', async () => {
      const newUser = {
        name: 'Marco Antonio Bruno da Silva',
        email: 'marco.bruno.br@gmail.com',
        password: 'q1w2e3r4',
      };

      const res = await request(server)
        .post(`${prefix}/users`)
        .send(newUser);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('name', newUser.name);
      expect(res.body).to.have.property('email', newUser.email);
      expect(res.body).to.not.have.property('password');
    });
  });
});
