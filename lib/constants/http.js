const values = require('./values.js');

module.exports = {
  baseApiURL: 'https://app.tendopay.ph',
  sandboxBaseApiURL: 'https://sandbox.tendopay.ph',

  authorizationEndpointURI: 'payments/api/' + values.apiVersion + '/order',
  bearerTokenEndpointURI: 'oauth/token',
  descriptionEndpointURI: 'payments/api/' + values.apiVersion + '/paymentDescription',
  redirectURI: 'payments/authorise',
  verificationEndpointURI: 'payments/api/' + values.apiVersion + '/verification',
  cancellationEndpointURI: 'payments/api/' + values.apiVersion + '/cancelPayment',
};
