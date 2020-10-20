const constants = require('../constants');

class VerifyTransactionRequest {
  constructor ({requestParams = {}}) {
    this._status = requestParams[constants.params.statusParam] || null;
    this._transactionId = requestParams[constants.params.transactionIdParam] || null;
    this._merchantOrderId = requestParams[constants.params.orderIdParam] || null;
    this._amount = requestParams[constants.params.amountParam] || null;
    this._message = requestParams[constants.params.messageParam] || null;
    this._xSignature = requestParams[constants.params.xSignatureParam] || null;
  }

  get status () {
    return this._status;
  }

  get transactionId () {
    return this._transactionId;
  }

  get merchantOrderId () {
    return this._merchantOrderId;
  }

  get amount () {
    return this._amount;
  }

  get message () {
    return this._message;
  }

  get xSignature () {
    return this._xSignature;
  }
}

module.exports = {
  VerifyTransactionRequest
};
