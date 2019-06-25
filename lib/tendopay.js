let version = require('../package.json').version;

let Client = require('./tendopay/tendopay_client').Client;
let Payment = require('./tendopay/tendopay_payment').Payment;

module.exports = {
  version,

  Client,
  Payment
};
