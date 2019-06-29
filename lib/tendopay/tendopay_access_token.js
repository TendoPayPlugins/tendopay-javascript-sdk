class AccessToken {
  /**
   * Access token
   * @param  {string} options.type      The token type
   * @param  {number} options.expiresIn Duration in seconds the token should be valid for
   * @param  {string} options.token     The access token
   */
  constructor ({type, expiresIn = -9999, token}) {
    this._type = type || null;
    this._expiresAt = (+new Date()) + (expiresIn * 1000);
    this._token = token || null;
  }

  isExpired() {
    return (+new Date()) > this._expiresAt;
  }

  get type () {
    return this._type;
  }

  get token () {
    return this._token;
  }
}

module.exports = {
  AccessToken
};
