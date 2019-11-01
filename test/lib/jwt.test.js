import { expect } from 'chai';

import Jwt from '../../src/lib/Jwt.lib';

const data = { name: 'Marco Bruno', email: 'marco.bruno.br@gmail.com' };

describe('Jwt', () => {
  describe('#encode()', () => {
    it('should encode the data', () => {
      const token = Jwt.encode(data);

      expect(token).to.be.a('string');
      expect(token).to.match(/^([^.]+\.){2}[^.]+$/);
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
  });
});
