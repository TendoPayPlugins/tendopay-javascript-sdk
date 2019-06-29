const version = require('../package.json').version;

const Client = require('./tendopay/tendopay_client').Client;
const Payment = require('./tendopay/tendopay_payment').Payment;

module.exports = {
  version,

  Client,
  Payment
};
