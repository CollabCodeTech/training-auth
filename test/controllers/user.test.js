import request from 'supertest';
import { expect } from 'chai';

import User from '../../src/api/components/user/user.model';
import server from '../../src/api/server';
import UserBuilder from '../data-builders';

const prefix = '/api';

describe(`${prefix}/users`, () => {
  before(() => User.deleteMany());
  after(() => User.deleteMany());

  describe('GET /', () => {
    it('should return all users', async () => {
      const res = await request(server).get(`${prefix}/users`);

      expect(res.status).to.equal(200);
    });
  });

  describe('POST /', () => {
    it('should return user when the all request body is valid', async () => {
      const newUser = UserBuilder.randomUserInfo();

      const res = await request(server)
        .post(`${prefix}/users`)
        .send(newUser);

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('_id');
      expect(res.body).to.have.property('name', newUser.name);
      expect(res.body).to.have.property('email', newUser.email.toLowerCase());
      expect(res.body).to.not.have.property('password');
    });
  });
});
