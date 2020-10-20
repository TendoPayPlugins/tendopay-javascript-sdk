const utils = require('../lib/utils');

describe('Utilities', () => {
  const deleteEnvVariables = () => {
    delete process.env.MERCHANT_ID;
    delete process.env.MERCHANT_SECRET;
    delete process.env.CLIENT_ID;
    delete process.env.CLIENT_SECRET;
  }

  beforeEach(deleteEnvVariables);
  afterEach(deleteEnvVariables);

  it('should return the lib version', () => {
    const version = require('../package.json').version;

    expect(utils.getVersion()).toBe(version);
  });

  it('should return client and merchant IDs and secrets', () => {
    process.env.CLIENT_ID = 'cid';
    process.env.CLIENT_SECRET = 'csecret';

    expect(utils.getClientId()).toBe('cid');
    expect(utils.getClientSecret()).toBe('csecret');
  });

  it('should return the right base API URL', () => {
    expect(utils.getBaseApiURL()).toBe('https://app.tendopay.ph');
    expect(utils.getBaseApiURL(false)).toBe('https://app.tendopay.ph');

    expect(utils.getBaseApiURL(true)).toBe('https://sandbox.tendopay.ph');
  });

  it('should hash parameters', () => {
    const params = {
      tp_amount: 1000,
      tp_currency: 'PHP',
      tp_merchant_order_id: 'TEST-OID-123324567890',
      tp_redirect_url: 'http://localhost:8000/purchase',
      tp_description: 'Test Order #1',
      tp_billing_city: 'Manila',
      tp_billing_address1: '123 Street',
      tp_billing_postcode: '1234',
      tp_shipping_city: 'Manila',
      tp_shipping_address1: '456 Street',
      tp_shipping_postcode: '5678',
      tp_merchant_user_id: '123',
      some_other_value: 'other_value'
    };

    process.env.CLIENT_SECRET = 'csecret1';
    expect(utils.xSignature(params)).toBe('46d5cbc2a2c3c980b086f1e44fcd210ecd9a7a2bec8f98a0f7cb8c373e677f36');

    process.env.CLIENT_SECRET = 'csecret2';
    expect(utils.xSignature(params)).toBe('6801734de8062b96ea7e5523f7f9101c44912cb8c1a4c31e2d7c65cd525a41b1');
  });
});
