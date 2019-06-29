const Client = require('../../lib/tendopay/tendopay_client').Client;
const Payment = require('../../lib/tendopay/tendopay_payment').Payment;
const AccessToken = require('../../lib/tendopay/tendopay_access_token').AccessToken;

const utils = require('../../lib/utils');

describe('TendoPay Client', () => {
  const createEnvVariables = () => {
    process.env.MERCHANT_ID = 'mid';
    process.env.MERCHANT_SECRET = 'msecret';
    process.env.CLIENT_ID = 'cid';
    process.env.CLIENT_SECRET = 'csecret';
    process.env.SANDBOX_HOST_URL = 'http://sandbox';
    process.env.REDIRECT_URL = 'http://redirect';
    process.env.ERROR_REDIRECT_URL = 'http://error-redirect';
  }

  const deleteEnvVariables = () => {
    delete process.env.MERCHANT_ID;
    delete process.env.MERCHANT_SECRET;
    delete process.env.CLIENT_ID;
    delete process.env.CLIENT_SECRET;
    delete process.env.SANDBOX_HOST_URL;
    delete process.env.REDIRECT_URL;
    delete process.env.ERROR_REDIRECT_URL;
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
      expect(prodClient.errorRedirectURL).toBe('http://error-redirect');
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

    beforeAll(() => {
      createEnvVariables();
    });
    beforeEach(() => {
      client = new Client(); // Initialize a new client before each

      spyOn(client._httpClient, 'post');
    });
    afterEach(() => {
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
        param1: 'desc1'
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
          'payments/api/v1/authTokenRequest',
          {
            ...params,
            'tendopay_hash': '7d2e7b42371ddfe39fa15db23513f484f52b0bb10c70475de8385d8fbcad7637'
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

    it('should compute a description', () => {
      var items = [{
        item1: 'desc1'
      }];

      expect(client.computeDescription(items)).toBe('{"items":[{"item1":"desc1"}]}');
    });

    describe('TendoPay link generation', () => {
      it('should throw an error if no payment is defined', done => {
        expectAsync(client.getTendoPayURL()).toBeRejectedWith(new Error('No payment defined'))
        .then(done);
      });

      it('should generate the URL', done => {
        // Return access token on first call, request token on second call
        client._httpClient.post.and.returnValues(serverAccessToken, 'request-token');

        spyOn(utils, 'getRedirectURI').and.callThrough();

        client.payment = new Payment({
          merchantOrderId: 'moid',
          description: 'desc',
          requestAmount: 'reqa',
          items: [
            {
              item1: 'desc1'
            }
          ]
        });

        client.getTendoPayURL()
        .then(tendoPayURL => {
          expect(utils.getRedirectURI).toHaveBeenCalledWith(
            false,
            {
              tendopay_amount: 'reqa',
              tendopay_customer_reference_1: 'moid',
              tendopay_description: '{"items":[{"item1":"desc1"}]}',
              tendopay_tendo_pay_vendor_id: 'mid',
              tendopay_authorisation_token: 'request-token',
              tendopay_redirect_url: 'http://redirect',
              tendopay_vendor: 'mid',
              tendopay_hash: '16f05ee7a69febf5b06909de19fe9721baa672d9e642420c9feef6f4a1781233'
            }
          );
          done();
        });
      });
    });
  });
});
