const utils = require('../lib/utils');

describe('Utilities', () => {
  const deleteEnvVariables = () => {
    delete process.env.MERCHANT_ID;
    delete process.env.MERCHANT_SECRET;
    delete process.env.CLIENT_ID;
    delete process.env.CLIENT_SECRET;
    delete process.env.SANDBOX_HOST_URL;
  }

  beforeEach(deleteEnvVariables);
  afterEach(deleteEnvVariables);

  it('should return the lib version', () => {
    const version = require('../package.json').version;

    expect(utils.getVersion()).toBe(version);
  });

  it('should return client and merchant IDs and secrets', () => {
    process.env.MERCHANT_ID = 'mid';
    process.env.MERCHANT_SECRET = 'msecret';
    process.env.CLIENT_ID = 'cid';
    process.env.CLIENT_SECRET = 'csecret';

    expect(utils.getMerchantId()).toBe('mid');
    expect(utils.getMerchantSecret()).toBe('msecret');
    expect(utils.getClientId()).toBe('cid');
    expect(utils.getClientSecret()).toBe('csecret');
  });

  it('should return the right base API URL', () => {
    expect(utils.getBaseApiURL()).toBe('https://app.tendopay.ph');
    expect(utils.getBaseApiURL(false)).toBe('https://app.tendopay.ph');

    expect(utils.getBaseApiURL(true)).toBe('https://sandbox.tendopay.dev');
    process.env.SANDBOX_HOST_URL = 'http://sandbox';
    expect(utils.getBaseApiURL(true)).toBe('http://sandbox');
  });

  it('should return the right redirect URI', () => {
    const params = {
      param1: 'test1',
      param2: 'test2'
    };

    const prodRedirectURI = 'https://app.tendopay.ph/payments/authorise';
    expect(utils.getRedirectURI()).toBe(prodRedirectURI);
    expect(utils.getRedirectURI(false)).toBe(prodRedirectURI);
    expect(utils.getRedirectURI(false, params)).toBe(prodRedirectURI + '?param1=test1&param2=test2');

    const sandboxRedirectURI = 'https://sandbox.tendopay.dev/payments/authorise';
    expect(utils.getRedirectURI(true)).toBe(sandboxRedirectURI);
    expect(utils.getRedirectURI(true, params)).toBe(sandboxRedirectURI + '?param1=test1&param2=test2');
  });

  it('should hash parameters', () => {
    const params = {
      param1: 'test1',
      param2: 'test2'
    };

    process.env.MERCHANT_SECRET = 'msecret1';
    expect(utils.hash(params)).toBe('67b36f2c1b611d5dac96328556d443c55b10634902eebec7c30c24e728ad829c');

    process.env.MERCHANT_SECRET = 'msecret2';
    expect(utils.hash(params)).toBe('20c389dd1e1aa65a86a3e7332f58383d58168e18179edc2da75cdd4ee6c822b3');
  });
});
