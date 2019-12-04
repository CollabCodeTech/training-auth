import moment from 'moment';
import { expect } from 'chai';

import Jwt from '../../src/lib/jwt.lib';

const data = { name: 'Marco Bruno', email: 'marco.bruno.br@gmail.com' };

describe('jwt.lib', () => {
  describe('#encode()', () => {
    let token;

    before(() => {
      token = Jwt.encode(data, { expiresIn: '1day' });
    });

    it('should encode the data', () => {
      expect(token).to.be.a('string');
      expect(token).to.match(/^([^.]+\.){2}[^.]+$/);
    });

    it('should set expire time', () => {
      const dataDecode = Jwt.decode(token);

      expect(dataDecode).to.have.property('exp');
    });
  });

  describe('#decode()', () => {
    let token;

    before(() => {
      token = Jwt.encode(data);
    });

    after(() => delete data.iat);

    it('should decode the data', () => {
      const dataDecode = Jwt.decode(token);

      delete dataDecode.iat;

      expect(dataDecode).to.have.property('name');
      expect(dataDecode).to.have.property('email');
      expect(dataDecode).to.deep.equals(data);
    });

    it('should reject expired token', () => {
      data.iat = moment
        .utc()
        .subtract(20, 'days')
        .unix();

      token = Jwt.encode(data, { expiresIn: '1day' });

      expect(() => Jwt.decode(token)).to.throw();
    });
  });

  describe('#refresh()', () => {
    afterEach(() => delete data.iat);

    it('should return new token when send valid token', () => {
      data.iat = moment
        .utc()
        .subtract(1, 'hour')
        .unix();

      const token = Jwt.encode(data);
      const newToken = Jwt.refresh(token);
      const dataDecode = Jwt.decode(newToken);

      delete dataDecode.iat;
      delete data.iat;

      expect(dataDecode).to.have.property('name');
      expect(dataDecode).to.have.property('email');
      expect(dataDecode).to.deep.equals(data);
      expect(newToken).to.not.be.equals(token);
    });

    it('should not return new token when send expired token', () => {
      data.iat = moment
        .utc()
        .subtract(2, 'days')
        .unix();

      const token = Jwt.encode(data, { expiresIn: '1day' });

      expect(() => Jwt.refresh(token)).to.throw();
    });

    it('should return new token with expire date when send valid token', () => {
      const token = Jwt.encode(data, { expiresIn: '1day' });
      const newToken = Jwt.refresh(token, { expiresIn: '1day' });
      const dataDecode = Jwt.decode(newToken);

      expect(dataDecode).to.have.property('exp');
    });
  });
});
