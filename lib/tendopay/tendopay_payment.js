class Payment {
  constructor (params = {}) {
    this.merchantOrderId = params.merchantOrderId || null;
    this.description = params.description || null;
    this.requestAmount = params.requestAmount || null;
    this.items = params.items || [];
  }

  get merchantOrderId () {
    return this._merchantOrderId;
  }

  set merchantOrderId (merchantOrderId) {
    this._merchantOrderId = merchantOrderId;
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
