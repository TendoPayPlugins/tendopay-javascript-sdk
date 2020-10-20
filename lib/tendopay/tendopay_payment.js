const _ = require('lodash');
const constants = require('../constants');

class Payment {
  /**
   * Payment
   * @param  {number} params.amount The price of the payment
   * @param  {string} params.currency The currency the order is placed in
   * @param  {string} params.merchantOrderId The order ID
   * @param  {string} [params.description] A description of the order
   * @param  {string} [params.billingCity] The billing address' city
   * @param  {string} [params.billingAddress] The billing address
   * @param  {string} [params.billingPostcode] The billing postal code
   * @param  {string} [params.shippingCity] The shipping address' city
   * @param  {string} [params.shippingAddress] The shipping address
   * @param  {string} [params.shippingPostcode] The shipping postal code
   * @param  {string} [params.userId] The user ID
   */
  constructor (params = {}) {
    this.amount = params.amount || null;
    this.currency = params.currency || null;
    this.merchantOrderId = params.merchantOrderId || null;
    this.userId = params.userId || null;
    this.description = params.description || null;
    this.billingCity = params.billingCity || null;
    this.billingAddress = params.billingAddress || null;
    this.billingPostcode = params.billingPostcode || null;
    this.shippingCity = params.shippingCity || null;
    this.shippingAddress = params.shippingAddress || null;
    this.shippingPostcode = params.shippingPostcode || null;
  }

  get merchantOrderId () {
    return this._merchantOrderId;
  }

  set merchantOrderId (merchantOrderId) {
    this._merchantOrderId = merchantOrderId;
  }

  get userId () {
    return this._userId;
  }

  set userId (userId) {
    this._userId = userId;
  }

  get description () {
    return this._description;
  }

  set description (description) {
    this._description = (description || '').slice(0, constants.payment.descriptionMax);
  }

  get amount () {
    return this._amount;
  }

  set amount (amount) {
    this._amount = amount;
  }

  get currency() {
    return this._currency;
  }

  set currency(currency) {
    this._currency = currency;
  }

  get billingCity() {
    return this._billingCity;
  }

  set billingCity(billingCity) {
    this._billingCity = billingCity;
  }

  get billingAddress() {
    return this._billingAddress;
  }

  set billingAddress(billingAddress) {
    this._billingAddress = billingAddress;
  }

  get billingPostcode() {
    return this._billingPostcode;
  }

  set billingPostcode(billingPostcode) {
    this._billingPostcode = billingPostcode;
  }

  get shippingCity() {
    return this._shippingCity;
  }

  set shippingCity(shippingCity) {
    this._shippingCity = shippingCity;
  }

  get shippingAddress() {
    return this._shippingAddress;
  }

  set shippingAddress(shippingAddress) {
    this._shippingAddress = shippingAddress;
  }

  get shippingPostcode() {
    return this._shippingPostcode;
  }

  set shippingPostcode(shippingPostcode) {
    this._shippingPostcode = shippingPostcode;
  }
}

module.exports = {
  Payment
};
