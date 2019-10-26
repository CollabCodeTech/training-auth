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
      const res = await request(server).post(`${prefix}/auth/login`);

      expect(res.status).to.equal(200);
    });
  });
});
