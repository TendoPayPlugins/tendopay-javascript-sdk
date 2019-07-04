module.exports = {
  baseApiURL: 'https://app.tendopay.ph',
  sandboxBaseApiURL: 'https://sandbox.tendopay.dev',

  authorizationEndpointURI: 'payments/api/v1/authTokenRequest',
  bearerTokenEndpointURI: 'oauth/token',
  descriptionEndpointURI: 'payments/api/v1/paymentDescription',
  redirectURI: 'payments/authorise',
  verificationEndpointURI: 'payments/api/v1/verification'
};
