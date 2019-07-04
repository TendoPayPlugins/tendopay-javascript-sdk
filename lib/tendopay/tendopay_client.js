const _ = require('lodash');
const axios = require('axios');

const Payment = require('./tendopay_payment').Payment;
const AccessToken = require('./tendopay_access_token').AccessToken;
const VerifyTransactionResponse = require('./tendopay_verify_transaction_response').VerifyTransactionResponse;

const utils = require('../utils');
const constants = require('../constants');

class Client {
  constructor (sandboxEnabled = false) {
    this.sandboxEnabled = sandboxEnabled;

    this.checkMandatoryEnvVariables();
    this.initRedirectURLs();
    this.initHttpClient();
  }

  checkMandatoryEnvVariables () {
    if (_.isEmpty(utils.getMerchantId()) ||
        _.isEmpty(utils.getMerchantSecret()) ||
        _.isEmpty(utils.getClientId()) ||
        _.isEmpty(utils.getClientSecret())) {
      throw new Error('Missing environment variable MERCHANT_ID, MERCHANT_SECRET, CLIENT_ID or CLIENT_SECRET');
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
      error => Promise.reject({statusCode: error.response.status, data: error.response.data})
    );
  }

  async getTendoPayURL () {
    if (this.payment == null) throw new Error('No payment defined');

    let requestTokenparams = {
      [constants.params.amountParam]: this.payment.requestAmount,
      [constants.params.orderIdParam]: this.payment.merchantOrderId,
      [constants.params.descriptionParam]: this.computeDescription(this.payment.items),
      [constants.params.vendorIdParam]: utils.getMerchantId()
    };

    let requestToken = await this.requestRequestToken(requestTokenparams);

    let paymentDescriptionParams = {
      ...requestTokenparams,
      [constants.params.authTokenParam]: requestToken
    };

    await this.requestPaymentDescription(paymentDescriptionParams);

    let redirectURIParams = {
      ..._.omit(paymentDescriptionParams, constants.params.descriptionParam),
      [constants.params.redirectUrlParam]: this.redirectURL,
      [constants.params.vendorParam]: utils.getMerchantId()
    };

    return utils.getRedirectURI(
      this.sandboxEnabled,
      {
        ...redirectURIParams,
        tendopay_hash: utils.hash(redirectURIParams)
      }
    );
  }

  computeDescription (items) {
    return JSON.stringify({items});
  }

  async requestPaymentDescription (params) {
    return this._httpClient.post(constants.http.descriptionEndpointURI, {
      ...params,
      tendopay_hash: utils.hash(params)
    },
    {
      headers: {
        ...await this.getAuthorizationHeader()
      }
    });
  }

  async requestRequestToken (params) {
    return this._httpClient.post(constants.http.authorizationEndpointURI, {
      ...params,
      tendopay_hash: utils.hash(params)
    },
    {
      headers: {
        ...await this.getAuthorizationHeader()
      }
    });
  }

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

  async verifyTransaction ({merchantOrderId, verificationRequest}) {
    if (merchantOrderId !== verificationRequest.merchantOrderId) {
      throw new Error('Merchant order ID different than the one in the request');
    }

    let params = {
      [constants.params.dispositionParam]: verificationRequest.disposition,
      [constants.params.transactionNumberParam]: verificationRequest.transactionNumber,
      [constants.params.verificationTokenParam]: verificationRequest.verificationToken,
      [constants.params.userIdParam]: verificationRequest.userId,
      [constants.params.orderIdParam]: merchantOrderId,
      [constants.params.vendorIdParam]: utils.getMerchantId()
    };

    let response = await this._httpClient.get(constants.http.verificationEndpointURI, {
      params: {
        ...params,
        tendopay_hash: utils.hash(params)
      },
      headers: {
        ...await this.getAuthorizationHeader()
      }
    });

    return new VerifyTransactionResponse({
      responseParams: response
    });
  }

  static isCallbackRequest ({request}) {
    if (request == null || _.isEmpty(request.query)) return false;

    return request.query[constants.params.dispositionParam] != null &&
           request.query[constants.params.transactionNumberParam] != null &&
           request.query[constants.params.verificationTokenParam] != null &&
           request.query[constants.params.hashParam] != null;
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
}

module.exports = {
  Client
};
