const Payment = require('../../lib/tendopay/tendopay_payment').Payment;

describe('TendoPay Payment', () => {
  describe('constructor', () => {
    it('should initialize an empty Payment object when no parameters', () => {
      const payment = new Payment();

      expect(payment.amount).toBeNull();
      expect(payment.currency).toBeNull();
      expect(payment.merchantOrderId).toBeNull();
      expect(payment.userId).toBeNull();
      expect(payment.description).toBe('');
      expect(payment.billingCity).toBeNull();
      expect(payment.billingAddress).toBeNull();
      expect(payment.billingPostcode).toBeNull();
      expect(payment.shippingCity).toBeNull();
      expect(payment.shippingAddress).toBeNull();
      expect(payment.shippingPostcode).toBeNull();
    });

    it('should initialize a Payment object when parameters', () => {
      const payment = new Payment({
        amount: 1000,
        currency: 'PHP',
        merchantOrderId: '123456',
        userId: '123',
        description: 'Long text over 50 char should be truncated here... Anything here shouldn\'t appear',
        billingCity: 'Manila',
        billingAddress: '123 Street',
        billingPostcode: '1234',
        shippingCity: 'Manila',
        shippingAddress: '456 Street',
        shippingPostcode: '5678'
      });

      expect(payment.amount).toBe(1000);
      expect(payment.currency).toBe('PHP');
      expect(payment.merchantOrderId).toBe('123456');
      expect(payment.userId).toBe('123');
      expect(payment.description).toBe('Long text over 50 char should be truncated here...');
      expect(payment.billingCity).toBe('Manila');
      expect(payment.billingAddress).toBe('123 Street');
      expect(payment.billingPostcode).toBe('1234');
      expect(payment.shippingCity).toBe('Manila');
      expect(payment.shippingAddress).toBe('456 Street');
      expect(payment.shippingPostcode).toBe('5678');
    });
  });
});
