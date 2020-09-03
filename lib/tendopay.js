const version = require('../package.json').version;

const Client = require('./tendopay/tendopay_client').Client;
const Payment = require('./tendopay/tendopay_payment').Payment;
const VerifyTransactionRequest = require('./tendopay/tendopay_verify_transaction_request').VerifyTransactionRequest;

module.exports = {
  version,

  Client,
  Payment,
  VerifyTransactionRequest
};
