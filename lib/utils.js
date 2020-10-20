const _ = require('lodash');
const crypto = require('crypto');
const queryString = require('query-string');
const constants = require('./constants');

module.exports = {
  getVersion: () => require('../package.json').version,

  getClientId: () => process.env.CLIENT_ID,
  getClientSecret: () => process.env.CLIENT_SECRET,

  getBaseApiURL (sandboxEnabled = false) {
    if (sandboxEnabled) {
      return process.env.SANDBOX_HOST_URL || constants.http.sandboxBaseApiURL;
    }

    return constants.http.baseApiURL;
  },

  xSignature(params) {
    params = _.cloneDeep(params);
    const client_secret = this.getClientSecret();

    const message = Object.keys(params)
      .sort()
      .filter(p => p.indexOf('tp_') === 0)
      .reduce((p, k) => (`${p}${k}${String(params[k]).trim()}`), '');

    const hash = crypto.createHmac('sha256', client_secret).update(message).digest('hex');
    return hash;
  },
};
