const CancelTransactionRequest = require('../../lib/tendopay/tendopay_cancel_transaction_request').CancelTransactionRequest;

describe('TendoPay CancelTransactionRequest', () => {
  describe('constructor', () => {
    it('should construct an empty CancelTransactionRequest object when empty parameters', () => {
      const cancelTransactionRequest = new CancelTransactionRequest({});

      expect(cancelTransactionRequest.transactionNumber).toBeNull();
      expect(cancelTransactionRequest.hash).toBeNull();
    });

    it('should construct a CancelTransactionRequest object with parameters', () => {
      const cancelTransactionRequest = new CancelTransactionRequest({
        requestParams: {
          tendopay_transaction_number: 'transacnb',
          tendopay_hash: 'hash'
        }
      });

      expect(cancelTransactionRequest.transactionNumber).toBe('transacnb');
      expect(cancelTransactionRequest.hash).toBe('hash');
    });
  });
});
