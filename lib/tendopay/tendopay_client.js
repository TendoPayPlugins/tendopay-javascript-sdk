class TendoPayClient {
  constructor () {
    this.checkMandatoryEnvVariables();
    this.writeSandboxModeToEnv(false);
    this.initRedirectURLs();
  }

  checkMandatoryEnvVariables () {
    if (process.env.MERCHANT_ID == null ||
        process.env.MERCHANT_SECRET == null ||
        process.env.CLIENT_ID == null ||
        process.env.CLIENT_SECRET == null) {
      throw new Error('Missing environment variable MERCHANT_ID, MERCHANT_SECRET, CLIENT_ID or CLIENT_SECRET');
    }
  }

  writeSandboxModeToEnv (sandboxMode) {
    process.env.TENDOPAY_SANDBOX_ENABLED = sandboxMode;
  }

  initRedirectURLs () {
    this.redirectURL = process.env.REDIRECT_URL;
    this.errorRedirectURL = process.env.ERROR_REDIRECT_URL;
  }

  enableSandbox () {
    this.writeSandboxModeToEnv(true);
  }

  get redirectURL () {
    return this._redirectURL;
  }

  set redirectURL (url) {
    this._redirectURL = url;
  }

  get errorRedirectURL () {
    return this._errorRedirectURL;
  }

  set errorRedirectURL (url) {
    this._errorRedirectURL = url;
  }
}

module.exports = {
  TendoPayClient: TendoPayClient
};
