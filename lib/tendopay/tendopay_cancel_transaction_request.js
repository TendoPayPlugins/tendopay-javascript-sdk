const constants = require('../constants');

class CancelTransactionRequest {
  constructor ({requestParams = {}}) {
    this._transactionNumber = requestParams[constants.params.transactionNumberParam] || null;
    this._hash = requestParams[constants.params.hashParam] || null;
  }

  get transactionNumber () {
    return this._transactionNumber;
  }

  get hash () {
    return this._hash;
  }
}

module.exports = {
  CancelTransactionRequest
};
