const utils = require('../lib/utils');
const constants = require('../lib/constants');

describe('Utilities', () => {
  process.env.MERCHANT_ID = 'mid';
  process.env.MERCHANT_SECRET = 'msecret';
  process.env.CLIENT_ID = 'cid';
  process.env.CLIENT_SECRET = 'csecret';

  it('should return the lib version', () => {
    const version = require('../package.json').version;

    expect(utils.getVersion()).toBe(version);
  });

  it('should return client and merchant IDs and secrets', () => {
    expect(utils.getMerchantId()).toBe('mid');
    expect(utils.getMerchantSecret()).toBe('msecret');
    expect(utils.getClientId()).toBe('cid');
    expect(utils.getClientSecret()).toBe('csecret');
  });

  it ('should return the right base API URL', () => {
    expect(utils.getBaseApiURL()).toBe(constants.http.baseApiURL);
    expect(utils.getBaseApiURL(false)).toBe(constants.http.baseApiURL);

    expect(utils.getBaseApiURL(true)).toBe(constants.http.sandboxBaseApiURL);
    process.env.SANDBOX_HOST_URL = 'http://sandbox';
    expect(utils.getBaseApiURL(true)).toBe('http://sandbox');
  });
});
