const VerifyTransactionRequest = require('../../lib/tendopay/tendopay_verify_transaction_request').VerifyTransactionRequest;

describe('TendoPay VerifyTransactionRequest', () => {
  describe('constructor', () => {
    it('should construct an empty VerifyTransactionRequest object when empty parameters', () => {
      const verifyTransactionRequest = new VerifyTransactionRequest({});

      expect(verifyTransactionRequest.status).toBeNull();
      expect(verifyTransactionRequest.transactionId).toBeNull();
      expect(verifyTransactionRequest.merchantOrderId).toBeNull();
      expect(verifyTransactionRequest.amount).toBeNull();
      expect(verifyTransactionRequest.message).toBeNull();
      expect(verifyTransactionRequest.xSignature).toBeNull();
    });

    it('should construct a VerifyTransactionRequest object with parameters', () => {
      const verifyTransactionRequest = new VerifyTransactionRequest({
        requestParams: {
          tp_transaction_status: 'tpts',
          tp_transaction_id: 'tpti',
          tp_merchant_order_id: 'tpcmoi',
          tp_amount: 1000,
          tp_message: 'tpm',
          x_signature: 'tpsignature'
        }
      });

      expect(verifyTransactionRequest.status).toBe('tpts');
      expect(verifyTransactionRequest.transactionId).toBe('tpti');
      expect(verifyTransactionRequest.amount).toBe(1000);
      expect(verifyTransactionRequest.merchantOrderId).toBe('tpcmoi');
      expect(verifyTransactionRequest.message).toBe('tpm');
      expect(verifyTransactionRequest.xSignature).toBe('tpsignature');
    });
  });
});
