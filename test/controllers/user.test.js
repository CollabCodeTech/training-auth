import request from 'supertest';
import { expect } from 'chai';

import server from '../../src/rest/server';

describe('/api/users', () => {
  describe('GET /', () => {
    it('should return all users', async () => {
      const res = await request(server).get('/api/users');

      expect(res.status).to.equal(200);
    });
  });

  describe('POST /', () => {
    it('should return user when the all request body is valid', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({
          name: 'Marco Antonio Bruno da Silva',
          email: 'marco.bruno.br@gmail.com',
          password: 'q1w2e3r4',
        });

      expect(res.status).to.equal(201);
    });
  });
});
