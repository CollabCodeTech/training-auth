import { expect } from 'chai';

import Jwt from '../../src/lib/Jwt.lib';

describe('Jwt', () => {
  describe('#decode()', () => {
    const data = { name: 'Marco Bruno', email: 'marco.bruno.br@gmail.com' };

    it('should encode the data', () => {
      const token = Jwt.encode(data);

      expect(token).to.be.a('string');
      expect(token).to.match(/^([^.]+\.){2}[^.]+$/);
    });
  });
});
