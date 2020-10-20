const PaymentResponse = require('../../lib/tendopay/tendopay_payment_response').PaymentResponse;

describe('TendoPay Payment Response', () => {
  describe('constructor', () => {
    it('should initialize an empty Payment object when no parameters', () => {
      const paymentResponse = new PaymentResponse({});

      expect(paymentResponse.orderToken).toBeNull();
      expect(paymentResponse.authorizeUrl).toBeNull();
    });

    it('should initialize a Payment object when parameters', () => {
      const payment = new PaymentResponse({
        requestParams: {
          tp_order_token: 'tot',
          tp_authorize_url: 'https://tp.authorize.url.com'
        }
      });

      expect(payment.orderToken).toBe('tot');
      expect(payment.authorizeUrl).toBe('https://tp.authorize.url.com');
    });
  });
});
