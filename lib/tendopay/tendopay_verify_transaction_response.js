const constants = require('../constants');

class VerifyTransactionResponse {
  constructor ({responseParams = {}}) {
    this._status = responseParams[constants.params.statusParam] || null;
    this._message = responseParams[constants.params.messageParam] || null;
    this._transactionNumber = responseParams[constants.params.transactionNumberParam] || null;
    this._hash = responseParams[constants.params.hashParam] || null;
  }

  isVerified () {
    return this.status === constants.values.statusSuccess;
  }

  get status () {
    return this._status;
  }

  get message () {
    return this._message;
  }

  get transactionNumber () {
    return this._transactionNumber;
  }

  get hash () {
    return this._hash;
  }
}

module.exports = {
  VerifyTransactionResponse
};
