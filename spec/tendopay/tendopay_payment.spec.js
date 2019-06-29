const Payment = require('../../lib/tendopay/tendopay_payment').Payment;

describe('TendoPay Payment', () => {
  it ('should construct an empty Payment object when no parameters', () => {
    const payment = new Payment();

    expect(payment.merchantOrderId).toBeNull();
    expect(payment.description).toBeNull();
    expect(payment.requestAmount).toBeNull();
    expect(payment.items).toEqual([]);
  });

  it ('should construct Payment object with parameters', () => {
    const items = [{
      item1: 'desc1'
    }];

    const payment = new Payment({
      merchantOrderId: 'moid',
      description: 'desc',
      requestAmount: 1000,
      items
    });

    expect(payment.merchantOrderId).toBe('moid');
    expect(payment.description).toBe('desc');
    expect(payment.requestAmount).toBe(1000);
    expect(payment.items).toEqual(items);
  });
});
