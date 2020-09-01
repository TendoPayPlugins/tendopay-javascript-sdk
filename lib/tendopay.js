const version = require('../package.json').version;

const Client = require('./tendopay/tendopay_client').Client;
const Payment = require('./tendopay/tendopay_payment').Payment;
const VerifyTransactionRequest = require('./tendopay/tendopay_verify_transaction_request').VerifyTransactionRequest;
const CancelTransactionRequest = require('./tendopay/tendopay_cancel_transaction_request').CancelTransactionRequest;

module.exports = {
  version,

  Client,
  Payment,
  VerifyTransactionRequest,
  CancelTransactionRequest
};
