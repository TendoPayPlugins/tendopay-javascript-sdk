const _ = require('lodash');
const crypto = require('crypto');
const queryString = require('query-string');
const constants = require('./constants');

module.exports = {
  getVersion: () => require('../package.json').version,

  getMerchantId: () => process.env.MERCHANT_ID,
  getMerchantSecret: () => process.env.MERCHANT_SECRET,
  getClientId: () => process.env.CLIENT_ID,
  getClientSecret: () => process.env.CLIENT_SECRET,

  getBaseApiURL (sandboxEnabled = false) {
    if (sandboxEnabled) {
      return process.env.SANDBOX_HOST_URL || constants.http.sandboxBaseApiURL;
    }

    return constants.http.baseApiURL;
  },

  getRedirectURI (sandboxEnabled = false, params = {}) {
    let redirectURI = this.getBaseApiURL(sandboxEnabled) + '/' + constants.http.redirectURI;

    if (!_.isEmpty(params)) redirectURI += '?' + queryString.stringify(params);

    return redirectURI;
  },

  hash (params) {
    params = _.cloneDeep(params);
    let secret = this.getMerchantSecret();

    let keys = Object.keys(params).sort();

    // Compute message
    let message = '';
    for (var i = 0; i < keys.length; i++) {
      if (params.hasOwnProperty(keys[i])) message += params[keys[i]];
    }

    let hmac = crypto.createHmac(constants.crypto.hashAlgorithm, secret).update(message).digest();

    return hmac.toString('hex');
  }
};
