const VerifyTransactionRequest = require('../../lib/tendopay/tendopay_verify_transaction_request').VerifyTransactionRequest;

describe('TendoPay VerifyTransactionRequest', () => {
  describe('constructor', () => {
    it('should construct an empty VerifyTransactionRequest object when empty parameters', () => {
      const verifyTransactionRequest = new VerifyTransactionRequest({});

      expect(verifyTransactionRequest.disposition).toBe('failure');
      expect(verifyTransactionRequest.transactionNumber).toBeNull();
      expect(verifyTransactionRequest.verificationToken).toBeNull();
      expect(verifyTransactionRequest.merchantOrderId).toBeNull();
      expect(verifyTransactionRequest.userId).toBeNull();
      expect(verifyTransactionRequest.hash).toBeNull();
    });

    it('should construct a VerifyTransactionRequest object with parameters', () => {
      const verifyTransactionRequest = new VerifyTransactionRequest({
        requestParams: {
          tendopay_disposition: 'dispo',
          tendopay_transaction_number: 'transacno',
          tendopay_verification_token: 'vftok',
          tendopay_customer_reference_1: 'cref',
          tendopay_user_id: 'uid',
          tendopay_hash: 'hash'
        }
      });

      expect(verifyTransactionRequest.disposition).toBe('dispo');
      expect(verifyTransactionRequest.transactionNumber).toBe('transacno');
      expect(verifyTransactionRequest.verificationToken).toBe('vftok');
      expect(verifyTransactionRequest.merchantOrderId).toBe('cref');
      expect(verifyTransactionRequest.userId).toBe('uid');
      expect(verifyTransactionRequest.hash).toBe('hash');
    });
  });
});
