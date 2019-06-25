class Payment {
  constructor (params = {}) {
    this.merchantId = params.merchantId;
    this.description = params.description;
    this.requestAmount = params.requestAmount;
    this.items = params.items;
  }

  get merchantId () {
    return this._merchantId;
  }

  set merchantId (merchantId) {
    this._merchantId = merchantId;
  }

  get description () {
    return this._description;
  }

  set description (description) {
    this._description = description;
  }

  get requestAmount () {
    return this._requestAmount;
  }

  set requestAmount (requestAmount) {
    this._requestAmount = requestAmount;
  }

  get items () {
    return this._items;
  }

  set items (items) {
    this._items = items;
  }
}

module.exports = {
  Payment
};
