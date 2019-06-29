const AccessToken = require('../../lib/tendopay/tendopay_access_token').AccessToken;

describe('TendoPay AccessToken', () => {
  describe('constructor', () => {
    it('should construct an empty AccessToken object when empty parameters', () => {
      const accessToken = new AccessToken({});

      expect(accessToken.type).toBeNull();
      expect(accessToken.token).toBeNull();
      expect(accessToken.isExpired()).toBe(true);
    });

    it('should construct an AccessToken object with parameters', done => {
      const accessToken = new AccessToken({
        type: 'ttype',
        token: 'ttoken',
        expiresIn: 0.5 // 0.5 second
      });

      expect(accessToken.type).toBe('ttype');
      expect(accessToken.token).toBe('ttoken');
      expect(accessToken.isExpired()).toBe(false);

      setTimeout(() => {
        expect(accessToken.isExpired()).toBe(true);
        done();
      }, 1000);
    });
  });
});
