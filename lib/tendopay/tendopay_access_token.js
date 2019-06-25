class AccessToken {
  /**
   * Access token
   * @param  {string} options.type      The token type
   * @param  {number} options.expiresIn Duration in seconds the token should be valid for
   * @param  {string} options.token     The access token
   */
  constructor ({type, expiresIn, token}) {
    this._type = type;
    this._expiresAt = (+new Date()) + (expiresIn * 1000);
    this._token = token;
  }

  isExpired() {
    return (+new Date()) > this.expiresIn;
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
