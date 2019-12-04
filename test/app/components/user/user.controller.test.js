import request from 'supertest';
import { expect } from 'chai';

import User from '../../../../src/app/components/user/user.model';
import server from '../../../../src/app/server';
import { UserBuilder } from '../../../data-builders';

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
    it("should return 400 when the body doesn't have name, email and password", async () => {
      const { status } = await request(server).post(`${prefix}/users`);

      expect(status).to.equals(400);
    });

    it("should return an array with keys field and error when the body doesn't have name, email and password", async () => {
      const { body } = await request(server).post(`${prefix}/users`);

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
        .post(`${prefix}/users`)
        .send({ ...newUser, ...nameInvalid });

      const errorName = () => body.find(error => error.field === 'name');

      expect(body).to.be.an('array');
      expect(errorName().field).to.equal('name');
    });

    it('should return an array with key field filled by email when email is invalid', async () => {
      const emailInvalid = UserBuilder.emailInvalid();

      const { body } = await request(server)
        .post(`${prefix}/users`)
        .send(emailInvalid);

      const errorEmail = () => body.find(error => error.field === 'email');

      expect(body).to.be.an('array');
      expect(errorEmail().field).to.equal('email');
    });

    it('should return status 409 and an array with key field filled by email when send registered email', async () => {
      const newUser = UserBuilder.randomUserInfo();

      await request(server)
        .post(`${prefix}/users`)
        .send(newUser);

      const { status, body } = await request(server)
        .post(`${prefix}/users`)
        .send(newUser);

      const errorEmail = () => body.find(error => error.field === 'email');

      expect(status).to.equal(409);
      expect(errorEmail().field).to.equal('email');
    });

    it('should return an array with key field filled by password when password is smaller than 8 chars', async () => {
      const passwordInvalid = UserBuilder.passwordInvalid();

      const { body } = await request(server)
        .post(`${prefix}/users`)
        .send(passwordInvalid);

      const errorPassword = () =>
        body.find(error => error.field === 'password');

      expect(body).to.be.an('array');
      expect(errorPassword().field).to.equal('password');
    });

    it('should return a user when the all request body is valid', async () => {
      const newUser = UserBuilder.randomUserInfo();

      const { status, body } = await request(server)
        .post(`${prefix}/users`)
        .send(newUser);

      expect(status).to.equal(201);
      expect(body).to.have.property('_id');
      expect(body).to.have.property('name', newUser.name);
      expect(body).to.have.property('email', newUser.email.toLowerCase());
      expect(body).to.not.have.property('password');
    });
  });
});
