const VerifyTransactionResponse = require('../../lib/tendopay/tendopay_verify_transaction_response').VerifyTransactionResponse;

describe('TendoPay VerifyTransactionResponse', () => {
  describe('constructor', () => {
    it('should construct an empty VerifyTransactionResponse object when empty parameters', () => {
      const verifyTransactionResponse = new VerifyTransactionResponse({});

      expect(verifyTransactionResponse.isVerified()).toBe(false);
      expect(verifyTransactionResponse.status).toBe('failure');
      expect(verifyTransactionResponse.message).toBeNull();
      expect(verifyTransactionResponse.transactionNumber).toBeNull();
      expect(verifyTransactionResponse.hash).toBeNull();
    });

    it('should construct a VerifyTransactionResponse object with parameters', () => {
      const verifyTransactionResponse = new VerifyTransactionResponse({
        responseParams: {
          tendopay_status: 'success',
          tendopay_message: 'message',
          tendopay_transaction_number: 'transacno',
          tendopay_hash: 'hash'
        }
      });

      expect(verifyTransactionResponse.isVerified()).toBe(true);
      expect(verifyTransactionResponse.status).toBe('success');
      expect(verifyTransactionResponse.message).toBe('message');
      expect(verifyTransactionResponse.transactionNumber).toBe('transacno');
      expect(verifyTransactionResponse.hash).toBe('hash');
    });

    it('should not be verified if the status is not success', () => {
      const verifyTransactionResponse = new VerifyTransactionResponse({
        responseParams: {
          tendopay_status: 'failure'
        }
      });

      expect(verifyTransactionResponse.isVerified()).toBe(false);
    });
  });
});
