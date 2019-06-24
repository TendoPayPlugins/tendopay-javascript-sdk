let version = require('../package.json').version;

let TendoPayClient = require('./tendopay/tendopay_client').TendoPayClient;

module.exports = {
  version: version,

  Client: TendoPayClient
};
