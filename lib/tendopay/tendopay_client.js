const _ = require('lodash');
const axios = require('axios');

const Payment = require('./tendopay_payment').Payment;
const AccessToken = require('./tendopay_access_token').AccessToken;

const utils = require('../utils');
const constants = require('../constants');

class Client {
  constructor (sandboxEnabled = false) {
    this.sandboxEnabled = sandboxEnabled;

    this.checkMandatoryEnvVariables();
    this.initRedirectURLs();
    this.initHttpClient();
  }

  /**********/
  /** INIT **/
  /**********/

  checkMandatoryEnvVariables () {
    if (_.isEmpty(utils.getClientId()) ||
        _.isEmpty(utils.getClientSecret())) {
      throw new Error('Missing environment variable CLIENT_ID or CLIENT_SECRET');
    }
  }

  initRedirectURLs () {
    this.redirectURL = process.env.REDIRECT_URL;
    this.errorRedirectURL = process.env.ERROR_REDIRECT_URL;
  }

  initHttpClient () {
    this._httpClient = axios.create({
      baseURL: utils.getBaseApiURL(this.sandboxEnabled),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Using': 'TendoPay_JavaScript_SDK_Client/' + utils.getVersion()
      }
    });

    this._httpClient.interceptors.request.use(request => {
      return request;
    });

    this._httpClient.interceptors.response.use(
      response => response.data,
      error => Promise.reject({statusCode: 500, data: error.message})
    );
  }

  /*******************/
  /** AUTHORIZATION **/
  /*******************/

  async getAccessToken () {
    if (this.accessToken != null && !this.accessToken.isExpired()) return this.accessToken.token;

    let accessToken = await this._httpClient.post(constants.http.bearerTokenEndpointURI, {
      grant_type: 'client_credentials',
      client_id: utils.getClientId(),
      client_secret: utils.getClientSecret()
    });

    this.accessToken = new AccessToken({
      type: accessToken.token_type,
      expiresIn: accessToken.expires_in,
      token: accessToken.access_token
    });

    return this.accessToken.token;
  }

  async getAuthorizationHeader () {
    return {
      'Authorization': 'Bearer ' + await this.getAccessToken()
    };
  }

  /**************/
  /** PAYMENTS **/
  /**************/

  async getTendoPayURL () {
    if (this.payment == null) throw new Error('No payment defined');

    let requestTokenparams = {
      [constants.params.amountParam]: this.payment.amount,
      [constants.params.currencyParam]: this.payment.currency,
      [constants.params.orderIdParam]: this.payment.merchantOrderId,
      [constants.params.redirectUrlParam]: this.redirectURL,
      [constants.params.descriptionParam]: this.payment.description,
      [constants.params.billingCityParam]: this.payment.billingCity,
      [constants.params.billingAddress1Param]: this.payment.billingAddress,
      [constants.params.billingPostcodeParam]: this.payment.billingPostcode,
      [constants.params.shippingCityParam]: this.payment.shippingCity,
      [constants.params.shippingAddress1Param]: this.payment.shippingAddress,
      [constants.params.shippingPostcodeParam]: this.payment.shippingPostcode,
      [constants.params.userIdParam]: this.payment.userId
    };

    const orderResponse = await this.requestRequestToken(requestTokenparams);

    return utils.getRedirectURI(orderResponse);
  }

  async requestRequestToken (params) {
    return this._httpClient.post(constants.http.authorizationEndpointURI, {
      ...params,
      [constants.params.xSignatureParam]: utils.xSignature(params)
    },
    {
      headers: {
        ...await this.getAuthorizationHeader()
      }
    });
  }

  /******************/
  /** VERIFICATION **/
  /******************/

  async verifyTransaction ({merchantOrderId, verificationRequest}) {
    if (merchantOrderId !== verificationRequest.merchantOrderId) {
      throw new Error('Merchant order ID different than the one in the request');
    }

    return true;
  }

  static isCallbackRequest ({request}) {
    if (request == null || _.isEmpty(request.query)) return false;

    const base = request.query[constants.params.statusParam] != null &&
      [
        constants.payment.statusPaid,
        constants.payment.statusFailed,
        constants.payment.statusCanceled
      ].indexOf(request.query[constants.params.statusParam]) !== -1 &&
      request.query[constants.params.transactionIdParam] != null &&
      request.query[constants.params.xSignatureParam] != null;

    switch (request.query[constants.params.statusParam]) {
      case constants.payment.statusPaid:
        return base &&
          request.query[constants.params.amountParam] != null;
      case constants.payment.statusFailed:
        return base &&
          request.query[constants.params.messageParam] != null;
      case constants.payment.statusCanceled:
        return base;
      default:
        return false;
    }
  }

  /******************/
  /** CANCELLATION **/
  /******************/

  async cancelTransaction ({ transactionNumber }) {
    let params = {
      [constants.params.transactionNumberParam]: transactionNumber
    };

    let response = await this._httpClient({
      url: constants.http.cancellationEndpointURI, 
      method: 'POST', 
      data: {
        ...params,
        [constants.params.xSignatureParam]: utils.xSignature(params)
      },
      headers: {
        ...await this.getAuthorizationHeader()
      }
    });

    return response;
  }

  get sandboxEnabled () {
    return this._sandboxEnabled;
  }

  set sandboxEnabled (sandboxEnabled) {
    this._sandboxEnabled = sandboxEnabled;
  }

  get redirectURL () {
    return this._redirectURL;
  }

  set redirectURL (redirectURL) {
    this._redirectURL = redirectURL;
  }

  get errorRedirectURL () {
    return this._errorRedirectURL;
  }

  set errorRedirectURL (errorRedirectURL) {
    this._errorRedirectURL = errorRedirectURL;
  }

  get payment () {
    return this._payment;
  }

  set payment (payment) {
    if (!(payment instanceof Payment)) throw new Error('Type mismatch: expecting tendopay.Payment');
    else this._payment = payment;
  }

  get accessToken () {
    return this._accessToken;
  }

  set accessToken (accessToken) {
    if (!(accessToken instanceof AccessToken)) throw new Error('Type mismatch: expecting tendopay.AccessToken');
    else this._accessToken = accessToken;
  }


  /****************/
  /** DEPRECATED **/
  /****************/
  /**
   * @deprecated
   */
  computeDescription (items) {
    return JSON.stringify({items}).slice(0, constants.payment.descriptionMax);
  }

  /**
   * @deprecated
   */
  async requestPaymentDescription (params) {
    return {}
  }
}

module.exports = {
  Client
};
