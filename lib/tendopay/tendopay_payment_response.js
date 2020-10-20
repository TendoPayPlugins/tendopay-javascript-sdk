const constants = require('../constants');

class PaymentResponse {
  constructor ({requestParams = {}}) {
    this._orderToken = requestParams[constants.params.orderTokenParam] || null;
    this._authorizeUrl = requestParams[constants.params.authorizeUrlParam] || null;
  }

  getRedirectURI() {
    return this.authorizeUrl;
  }

  get orderToken () {
    return this._orderToken;
  }

  get authorizeUrl () {
    return this._authorizeUrl;
  }
}

module.exports = {
  PaymentResponse
};
