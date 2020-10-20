const constants = require('../constants');

class NotifyRequest {
    constructor ({responseParams = {}}) {
        this._status = responseParams[constants.params.statusParam] || constants.values.statusFailure;
        this._message = responseParams[constants.params.messageParam] || null;
        this._transactionNumber = responseParams[constants.params.transactionNumberParam] || null;
        this._hash = responseParams[constants.params.xSignatureParam] || null;
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
    NotifyRequest
};
