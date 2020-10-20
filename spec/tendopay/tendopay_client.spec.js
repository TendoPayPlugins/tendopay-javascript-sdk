const Client = require('../../lib/tendopay/tendopay_client').Client;
const Payment = require('../../lib/tendopay/tendopay_payment').Payment;
const AccessToken = require('../../lib/tendopay/tendopay_access_token').AccessToken;
const VerifyTransactionRequest = require('../../lib/tendopay/tendopay_verify_transaction_request').VerifyTransactionRequest;

const utils = require('../../lib/utils');

describe('TendoPay Client', () => {
  const createEnvVariables = () => {
    process.env.CLIENT_ID = 'cid';
    process.env.CLIENT_SECRET = 'csecret';
    process.env.REDIRECT_URL = 'http://redirect';
  }

  const deleteEnvVariables = () => {
    delete process.env.CLIENT_ID;
    delete process.env.CLIENT_SECRET;
    delete process.env.REDIRECT_URL;
  }

  describe('constructor', () => {
    beforeEach(deleteEnvVariables);
    afterEach(deleteEnvVariables);

    it('should throw an error if mandatory environment variables are empty', () => {
      const constructorCall = () => {
        new Client();
      };

      expect(constructorCall).toThrowError();
    });

    it('should not throw an error if mandatory environment variables are not empty', () => {
      createEnvVariables();

      const constructorCall = () => {
        new Client();
      };

      expect(constructorCall).not.toThrowError();
    });

    it('should initialize the URIs and the http client', () => {
      createEnvVariables();

      const prodClient = new Client();
      expect(prodClient.sandboxEnabled).toBe(false);
      expect(prodClient.redirectURL).toBe('http://redirect');
      expect(prodClient._httpClient).not.toBeUndefined();

      const sandboxClient = new Client(true);
      expect(sandboxClient.sandboxEnabled).toBe(true);
    });
  });

  describe('setters', () => {
    beforeEach(createEnvVariables);
    afterEach(deleteEnvVariables);

    it('should throw an error when setting payment to a non-Payment instance', () => {
      const client = new Client();

      const errorPaymentSetterCall = () => {
        client.payment = 'Not a payment instance';
      };

      expect(errorPaymentSetterCall).toThrowError();

      const finePaymentSetterCall = () => {
        client.payment = new Payment();
      };

      expect(finePaymentSetterCall).not.toThrowError();
    });

    it('should throw an error when setting accessToken to a non-AccessToken instance', () => {
      const client = new Client();

      const errorAccessTokenSetterCall = () => {
        client.accessToken = 'Not a AccessToken instance';
      };

      expect(errorAccessTokenSetterCall).toThrowError();

      const fineAccessTokenSetterCall = () => {
        client.accessToken = new AccessToken({});
      };

      expect(fineAccessTokenSetterCall).not.toThrowError();
    });
  });

  describe('other functions', () => {
    let client;
    const serverAccessToken = {
      token_type: 'ttype',
      expires_in: 1000,
      access_token: 'ttoken'
    };

    beforeAll(createEnvVariables);
    beforeEach(() => {
      client = new Client(); // Initialize a new client before each

      spyOn(client._httpClient, 'get');
      spyOn(client._httpClient, 'post');
    });
    afterEach(() => {
      client._httpClient.get.calls.reset();
      client._httpClient.post.calls.reset();
    });
    afterAll(deleteEnvVariables);

    it('should get an access token from the server if no access token or if expired', done => {
      client._httpClient.post.and.returnValue(serverAccessToken);
      client.getAccessToken()
      .then(accessToken => {
        expect(accessToken).toBe('ttoken');
        expect(client.accessToken.type).toBe('ttype');
        expect(client.accessToken.token).toBe('ttoken');
        expect(client.accessToken.isExpired()).toBe(false);

        // No access token, get one from server
        expect(client._httpClient.post).toHaveBeenCalledTimes(1);

        client._httpClient.post.calls.reset();

        return client.getAccessToken();
      })
      .then(() => {
        // Access token not expired, no request to server
        expect(client._httpClient.post).toHaveBeenCalledTimes(0);

        client._httpClient.post.calls.reset();

        client.accessToken._expiresAt = 0;

        return client.getAccessToken();
      })
      .then(() => {
        // Access token expired, new request to server
        expect(client._httpClient.post).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should compute an authorization header', done => {
      client._httpClient.post.and.returnValue(serverAccessToken);

      client.getAuthorizationHeader()
      .then(header => {
        expect(client._httpClient.post).toHaveBeenCalledTimes(1); // Called once for access token
        expect(header).toEqual({Authorization: 'Bearer ttoken'});
        done();
      });
    });

    it('should get a request token', done => {
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

      // So that no call is triggered to get an access token
      client.accessToken = new AccessToken({
        type: serverAccessToken.type,
        expiresIn: serverAccessToken.expires_in,
        token: serverAccessToken.access_token
      });

      client.requestRequestToken(params)
      .then(requestToken => {
        expect(client._httpClient.post).toHaveBeenCalledWith(
          'payments/api/v2/order',
          {
            ...params,
            'x_signature': '7aecf5059d50b932e085c88b5956d1e341a41b01d9db3696f6a3f440598eb800'
          },
          {
            headers: {
              Authorization: 'Bearer ttoken'
            }
          }
        );
        expect(client._httpClient.post).toHaveBeenCalledTimes(1);

        done();
      });
    });

    describe('verifyTransaction', () => {
      it('should throw an error if merchant order ID param is different than the one in the request', done => {
        const merchantOrderId = 'cref';

        const verificationRequest = new VerifyTransactionRequest({
          requestParams: {
            tendopay_customer_reference_1: 'fake'
          }
        });

        expectAsync(client.verifyTransaction({merchantOrderId, verificationRequest}))
        .toBeRejectedWith(new Error('Merchant order ID different than the one in the request'))
        .then(done);
      });

      it('should verify a transaction', done => {
        const merchantOrderId = 'TEST-OID-12324567890';

        const verificationRequest = new VerifyTransactionRequest({
          requestParams: {
            tp_transaction_status: 'PAID',
            tp_amount: '1000',
            tp_transaction_id: '12215',
            tp_merchant_order_id: 'TEST-OID-12324567890',
            x_signature: '478f31ed761e7d319b38423d39e63db1da101eb33d113af98a7870916755db33'
          }
        });

        expectAsync(client.verifyTransaction({merchantOrderId, verificationRequest}))
        .toBeResolvedTo(true)
        .then(done());
      });
    });

    describe('isCallbackRequest', () => {
      it('should return false if some callback parameters are missing', done => {
        const merchantOrderId = 'cref';

        const params = {
          tp_merchant_order_id: 'TEST-OID-12324567890',
          tp_amount: '1000',
          x_signature: '478f31ed761e7d319b38423d39e63db1da101eb33d113af98a7870916755db33'
        }

        expect(Client.isCallbackRequest({ request: { query: params } }))
        .toBe(false);
        done();
      });

      it('should return false if paid callback is missing the amount', done => {
        const merchantOrderId = 'TEST-OID-12324567890';

        const params = {
          tp_transaction_status: 'PAID',
          tp_transaction_id: '12215',
          tp_merchant_order_id: 'TEST-OID-12324567890',
          x_signature: '478f31ed761e7d319b38423d39e63db1da101eb33d113af98a7870916755db33'
        }

        expect(Client.isCallbackRequest({ request: { query: params } }))
        .toBe(false);
        done()
      });

      it('should return false if failed callback is missing the message', done => {
        const merchantOrderId = 'TEST-OID-12324567890';

        const params = {
          tp_transaction_status: 'FAILED',
          tp_transaction_id: '12215',
          tp_merchant_order_id: 'TEST-OID-12324567890',
          x_signature: '478f31ed761e7d319b38423d39e63db1da101eb33d113af98a7870916755db33'
        }

        expect(Client.isCallbackRequest({ request: { query: params } }))
        .toBe(false);
        done()
      });

      it('should return true if all callback parameters are present', done => {
        const merchantOrderId = 'TEST-OID-12324567890';

        const params = {
          tp_transaction_status: 'PAID',
          tp_transaction_id: '12215',
          tp_merchant_order_id: 'TEST-OID-12324567890',
          tp_amount: 1000,
          x_signature: '478f31ed761e7d319b38423d39e63db1da101eb33d113af98a7870916755db33'
        }

        expect(Client.isCallbackRequest({ request: { query: params } }))
        .toBe(true);
        done()
      });
    });

    describe('cancelTransaction', () => {
      it('should cancel a transaction', done => {
        client.cancelTransaction({transactionNumber: 123456789})
        .then(cancelResponse => {
          expect(client._httpClient.get).toHaveBeenCalledWith('payments/api/v2/cancelPayment', {
            params: {
              tp_transaction_id: 123456789,
              x_signature: 'eca674eb08469b5032cef02a3399c812ddf9c5a51ae36af0a72db42f5fcde887'
            },
            headers: {
              Authorization: 'Bearer ttoken'
            }
          });
          expect(client._httpClient.get).toHaveBeenCalledTimes(1);
          expect(client._httpClient.post).toHaveBeenCalledTimes(1);

          done();
        })
        .catch(error => {
          done();
        });
      });
    });

    describe('TendoPay link generation', () => {
      it('should throw an error if no payment is defined', done => {
        expectAsync(client.getTendoPayURL()).toBeRejectedWith(new Error('No payment defined'))
        .then(done);
      });

      it('should generate the URL', done => {
        // Return access token on first call, request token on second call
        client._httpClient.post.and.returnValues('ttoken', {
          tp_order_token: 'tot',
          tp_authorize_url: 'https://tp.authorize.url.com'
        });

        client.payment = new Payment({
          amount: 1000,
          currency: 'PHP',
          merchantOrderId: 'TEST-OID-123324567890',
          description: 'Test Order #1',
          billingCity: 'Manila',
          billingAddress: '123 Street',
          billingPostcode: '1234',
          shippingCity: 'Manila',
          shippingAddress: '456 Street',
          shippingPostcode: '5678',
          userId: '123'
        });

        client.getTendoPayURL()
        .then(tendoPayUrl => {
          expect(tendoPayUrl).toBe('https://tp.authorize.url.com');
          done();
        });
      });
    });
  });
});
