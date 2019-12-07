import request from 'supertest';
import { expect } from 'chai';
import moment from 'moment';

import jwt from '../../../../src/lib/jwt.lib';
import User from '../../../../src/app/components/user/user.model';
import server from '../../../../src/app/server';
import { UserBuilder, TokenBuilder } from '../../../data-builders';

const prefix = '/api/user';

describe(`${prefix}`, () => {
  before(() => User.deleteMany());
  after(() => User.deleteMany());

  describe('POST /', () => {
    it("should return 400 when the body doesn't have name, email and password", async () => {
      const { status } = await request(server).post(`${prefix}`);

      expect(status).to.equals(400);
    });

    it("should return an array with keys field and error when the body doesn't have name, email and password", async () => {
      const { body } = await request(server).post(`${prefix}`);

      expect(body).to.be.an('array');
      expect(body.length).to.equal(3);
      expect(body[0]).to.have.property('field');
      expect(body[0]).to.have.property('error');
      expect(body[1]).to.have.property('field');
      expect(body[1]).to.have.property('error');
      expect(body[2]).to.have.property('field');
      expect(body[2]).to.have.property('error');
    });

    it('should return an array with key field filled by name when name smaller than 2 chars', async () => {
      const newUser = UserBuilder.randomUserInfo();
      const nameInvalid = UserBuilder.nameInvalid();

      const { body } = await request(server)
        .post(`${prefix}`)
        .send({ ...newUser, ...nameInvalid });

      const errorName = () => body.find(error => error.field === 'name');

      expect(body).to.be.an('array');
      expect(errorName().field).to.equal('name');
    });

    it('should return an array with key field filled by email when email is invalid', async () => {
      const emailInvalid = UserBuilder.emailInvalid();

      const { body } = await request(server)
        .post(`${prefix}`)
        .send(emailInvalid);

      const errorEmail = () => body.find(error => error.field === 'email');

      expect(body).to.be.an('array');
      expect(errorEmail().field).to.equal('email');
    });

    it('should return status 409 and an array with key field filled by email when send registered email', async () => {
      const newUser = UserBuilder.randomUserInfo();

      await request(server)
        .post(`${prefix}`)
        .send(newUser);

      const { status, body } = await request(server)
        .post(`${prefix}`)
        .send(newUser);

      const errorEmail = () => body.find(error => error.field === 'email');

      expect(status).to.equal(409);
      expect(errorEmail().field).to.equal('email');
    });

    it('should return an array with key field filled by password when password is smaller than 8 chars', async () => {
      const passwordInvalid = UserBuilder.passwordInvalid();

      const { body } = await request(server)
        .post(`${prefix}`)
        .send(passwordInvalid);

      const errorPassword = () =>
        body.find(error => error.field === 'password');

      expect(body).to.be.an('array');
      expect(errorPassword().field).to.equal('password');
    });

    it('should return a user when the all request body is valid', async () => {
      const newUser = UserBuilder.randomUserInfo();

      const { status, body } = await request(server)
        .post(`${prefix}`)
        .send(newUser);

      expect(status).to.equal(201);
      expect(body).to.have.property('email', newUser.email.toLowerCase());
    });
  });

  describe('POST /confirmation', () => {
    it(`should return status 400 when the body does't have token`, async () => {
      const { status } = await request(server).post(`${prefix}/confirmation`);

      expect(status).to.equal(400);
    });

    it('should return status 401 when send invalided token', async () => {
      const invalidToken = TokenBuilder.generateRandom();
      const { status } = await request(server)
        .post(`${prefix}/confirmation`)
        .send({ token: invalidToken });

      expect(status).to.equal(401);
    });

    it('should return status 401 when send expired token', async () => {
      const newUser = UserBuilder.randomUserInfo();
      const iat = moment
        .utc()
        .subtract(20, 'days')
        .unix();
      const token = jwt.encode(
        { name: newUser.name, iat },
        { expiresIn: '1day' }
      );
      const { status } = await request(server)
        .post(`${prefix}/confirmation`)
        .send({ token });

      expect(status).to.equal(401);
    });

    it('should return status 200 and email in body when send a valid token in body', async () => {
      const newUser = UserBuilder.randomUserInfo();
      const { body: email } = await request(server)
        .post(`${prefix}`)
        .send(newUser);
      const token = jwt.encode(email, { expiresIn: '1h' });
      const { status, body } = await request(server)
        .post(`${prefix}/confirmation`)
        .send({ token });

      expect(status).to.equal(200);
      expect(body).to.have.property('email');
    });
  });
});
