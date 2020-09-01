const constants = require('../constants');

class CancelTransactionResponse {
  constructor ({responseParams = {}}) {
    this._status = responseParams[constants.params.statusParam] || constants.values.statusFailure;
    this._message = responseParams[constants.params.messageParam] || null;
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

  get hash () {
    return this._hash;
  }
}

module.exports = {
  CancelTransactionResponse
};
