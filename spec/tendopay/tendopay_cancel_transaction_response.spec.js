const CancelTransactionResponse = require('../../lib/tendopay/tendopay_cancel_transaction_response').CancelTransactionResponse;

describe('TendoPay CancelTransactionResponse', () => {
  describe('constructor', () => {
    it('should construct an empty CancelTransactionResponse object when empty parameters', () => {
      const cancelTransactionResponse = new CancelTransactionResponse({});

      expect(cancelTransactionResponse.isVerified()).toBe(false);
      expect(cancelTransactionResponse.status).toBe('failure');
      expect(cancelTransactionResponse.message).toBeNull();
      expect(cancelTransactionResponse.hash).toBeNull();
    });

    it('should construct a CancelTransactionResponse object with parameters', () => {
      const cancelTransactionResponse = new CancelTransactionResponse({
        responseParams: {
          tendopay_status: 'success',
          tendopay_message: 'message',
          tendopay_hash: 'hash'
        }
      });

      expect(cancelTransactionResponse.isVerified()).toBe(true);
      expect(cancelTransactionResponse.status).toBe('success');
      expect(cancelTransactionResponse.message).toBe('message');
      expect(cancelTransactionResponse.hash).toBe('hash');
    });

    it('should not be verified if the status is not success', () => {
      const cancelTransactionResponse = new CancelTransactionResponse({
        responseParams: {
          tendopay_status: 'failure'
        }
      });

      expect(cancelTransactionResponse.isVerified()).toBe(false);
    });
  });
});
