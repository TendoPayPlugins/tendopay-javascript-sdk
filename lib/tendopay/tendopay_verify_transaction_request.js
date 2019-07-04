const constants = require('../constants');

class VerifyTransactionRequest {
  constructor ({requestParams = {}}) {
    this._disposition = requestParams[constants.params.dispositionParam] || constants.values.statusFailure;
    this._transactionNumber = requestParams[constants.params.transactionNumberParam] || null;
    this._verificationToken = requestParams[constants.params.verificationTokenParam] || null;
    this._merchantOrderId = requestParams[constants.params.orderIdParam] || null;
    this._userId = requestParams[constants.params.userIdParam] || null;
    this._hash = requestParams[constants.params.hashParam] || null;
  }

  get disposition () {
    return this._disposition;
  }

  get transactionNumber () {
    return this._transactionNumber;
  }

  get verificationToken () {
    return this._verificationToken;
  }

  get merchantOrderId () {
    return this._merchantOrderId;
  }

  get userId () {
    return this._userId;
  }

  get hash () {
    return this._hash;
  }
}

module.exports = {
  VerifyTransactionRequest
};
