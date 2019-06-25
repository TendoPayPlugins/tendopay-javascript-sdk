const _ = require('lodash');
const crypto = require('crypto');
const constants = require('./constants');

module.exports = {
  getVersion: () => require('../package.json').version,
  getMerchantId: () => process.env.MERCHANT_ID,
  getMerchantSecret: () => process.env.MERCHANT_SECRET,
  getClientId: () => process.env.CLIENT_ID,
  getClientSecret: () => process.env.CLIENT_SECRET,

  getBaseApiURL (sandboxEnabled) {
    if (sandboxEnabled) {
      return process.env.SANDBOX_HOST_URL || constants.http.sandboxBaseApiURL;
    }

    return constants.http.baseApiURL;
  },

  hash (params) {
    params = _.clone(params);
    let secret = this.getMerchantSecret();

    let keys = Object.keys(params).sort();

    // Compute message
    var message = '';
    for (var i = 0; i < keys.length; i++) {
      if (params.hasOwnProperty(keys[i])) message += params[keys[i]];
    }

    let hmac = crypto.createHmac(constants.crypto.hashAlgorithm, secret).update(message).digest();

    return hmac.toString('hex');
  }
};
