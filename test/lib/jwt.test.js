import moment from 'moment';
import { expect } from 'chai';

import Jwt from '../../src/lib/Jwt.lib';

const data = { name: 'Marco Bruno', email: 'marco.bruno.br@gmail.com' };

describe('Jwt', () => {
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
});
