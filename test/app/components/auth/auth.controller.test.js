/* eslint-disable prefer-destructuring */
import request from 'supertest';
import { expect } from 'chai';
import moment from 'moment';

import server from '../../../../src/app/server';
import User from '../../../../src/app/components/user/user.model';
import Jwt from '../../../../src/lib/jwt.lib';
import { UserBuilder, TokenBuilder } from '../../../data-builders';

const path = '/api/auth';

after(() => User.db.close());

describe(path, () => {
  let plaintextPassword;
  let newUser;

  before(async () => {
    await User.deleteMany();

    const newUserInfo = UserBuilder.randomUserInfo();

    plaintextPassword = newUserInfo.password;
    newUser = await UserBuilder.createOne(newUserInfo);
  });

  after(async () => {
    await User.deleteMany();
  });

  describe('POST /login', () => {
    it('should return status 400 and JSON error without email and password', async () => {
      const res = await request(server)
        .post(`${path}/login`)
        .send();
      const { status, body } = res;

      expect(status).to.equal(400);
      expect(body).to.have.property('field');
      expect(body).to.have.property('error');
    });

    it('should return status 401 and JSON error when email does not exist', async () => {
      const { status, body } = await request(server)
        .post(`${path}/login`)
        .send({ email: `no${newUser.email}`, password: plaintextPassword });

      expect(status).to.equal(401);
      expect(body).to.have.property('field');
      expect(body).to.have.property('error');
    });

    it('should return status 401 and JSON error when password is wrong', async () => {
      const { status, body } = await request(server)
        .post(`${path}/login`)
        .send({
          email: newUser.email,
          password: `wrong${plaintextPassword}wrong`
        });

      expect(status).to.equal(401);
      expect(body).to.have.property('field');
      expect(body).to.have.property('error');
    });

    it('should return status 200 with valid user and login', async () => {
      const { status, body } = await request(server)
        .post(`${path}/login`)
        .send({
          email: newUser.email,
          password: plaintextPassword
        });

      expect(status).to.equal(200);
      expect(body).to.have.property('message');
      expect(body).to.have.property('name');
    });

    it('should return set-cookie and JWT', async () => {
      const { headers } = await request(server)
        .post(`${path}/login`)
        .send({
          email: newUser.email,
          password: plaintextPassword
        });

      const cookies = headers['set-cookie'][0];

      expect(headers).to.have.property('set-cookie');
      expect(cookies).to.be.a('string');
      expect(cookies).to.match(/jwt=/);
    });

    it('should return JWT with expire date', async () => {
      const { headers } = await request(server)
        .post(`${path}/login`)
        .send({
          email: newUser.email,
          password: plaintextPassword
        });
      const cookies = headers['set-cookie'][0];
      const jwt = cookies.match(/jwt=([^;]+)/)[1];
      const dataDecode = Jwt.decode(jwt);

      expect(dataDecode).to.have.property('exp');
    });

    it('should have Set-Cookie with SameSite=Strict; Secure and HttpOnly', async () => {
      const { headers } = await request(server)
        .post(`${path}/login`)
        .send({
          email: newUser.email,
          password: plaintextPassword
        });
      const cookies = headers['set-cookie'][0];

      expect(headers).to.have.property('set-cookie');
      expect(cookies).to.be.a('string');
      expect(cookies).to.match(/SameSite=Strict/);
      expect(cookies).to.match(/HttpOnly/);
    });
  });

  describe('POST /refresh', () => {
    let resRefresh;
    let headersRefresh;
    let cookiesRefresh;
    let cookiesLogin;
    let loginJwt;
    let refreshJwt;

    beforeEach(async () => {
      const resLogin = await request(server)
        .post(`${path}/login`)
        .send({
          email: newUser.email,
          password: plaintextPassword
        });
      cookiesLogin = resLogin.headers['set-cookie'][0];
      loginJwt = cookiesLogin.match(/jwt=([^;]+)/)[1];

      resRefresh = await request(server)
        .post(`${path}/refresh`)
        .set('Cookie', [cookiesLogin])
        .send();
      headersRefresh = resRefresh.headers;
      cookiesRefresh = headersRefresh['set-cookie'][0];
      refreshJwt = cookiesRefresh.match(/jwt=([^;]+)/)[1];
    });

    it('should return status 200 when send valid token', () => {
      expect(resRefresh.status).to.equals(200);
    });

    it('should return Set-cookie with SameSite=Strict; Secure and HttpOnly', () => {
      expect(headersRefresh).to.have.property('set-cookie');
      expect(cookiesRefresh).to.be.a('string');
      expect(cookiesRefresh).to.match(/SameSite=Strict/);
      expect(cookiesRefresh).to.match(/HttpOnly/);
    });

    it('should return a new token when receiving a valid one', async () => {
      expect(cookiesRefresh).to.match(/jwt=/);
      expect(refreshJwt).to.not.be.equal(loginJwt);
    });

    it('should return status 401 when send expired token', async () => {
      const iat = moment
        .utc()
        .subtract(20, 'days')
        .unix();

      const token = Jwt.encode(
        { name: newUser.name, iat },
        { expiresIn: '1day' }
      );

      const cookie = cookiesLogin.replace(loginJwt, token);

      const { status, body } = await request(server)
        .post(`${path}/refresh`)
        .set('Cookie', [cookie])
        .send();

      expect(status).to.equals(401);
      expect(body).to.have.property('message');
    });

    it('should return status 401 when not send token', async () => {
      const { status } = await request(server)
        .post(`${path}/refresh`)
        .send();

      expect(status).to.equals(401);
    });

    it('should return status 401 when send invalided token', async () => {
      const invalidToken = TokenBuilder.generateRandom();
      const { status } = await request(server)
        .post(`${path}/refresh`)
        .set('Cookie', [invalidToken])
        .send();

      expect(status).to.equals(401);
    });
  });
});
