class Reply {
  constructor(raw) {
    /**
     * The original HTTP response object
     * @type {ServerResponse}
     */
    this.raw = raw;

    /**
     * The status code
     * @type {Number}
     */
    this._code = 200;
  }

  /**
   * Set the status code
   * @param {Number} statusCode the status code
   * @returns {Reply} this instance
   */
  code(statusCode) {
    this._code = statusCode;
    return this;
  }

  /**
   * Get the status code
   * @returns {Number} the status code
   */
  getCode() {
    return this._code;
  }

  /**
   * Set a header
   * @param {String} name the header to set
   * @param {*} value the value of the header
   * @returns {Reply} this instance
   */
  header(name, value) {
    this.raw.setHeader(name, value);
    return this;
  }

  /**
   * Remove a header
   * @param {String} name the header to remove
   * @returns {Reply} this instance
   */
  removeHeader(name) {
    this.raw.removeHeader(name);
    return this;
  }

  /**
   * Get a header
   * @param {String} name the name of the header
   * @returns {*} the value of the header
   */
  getHeader(name) {
    return this.raw.getHeader(name);
  }

  /**
   * Check if a header is set
   * @param {String} name the name of the header
   * @returns {Boolean} whether the header is set
   */
  hasHeader(name) {
    return this.raw.hasHeader(name);
  }

  /**
   * End the request and return data
   * @param {String} contentType the content type of the response
   * @param {*} content the content of the response
   * @returns {Reply} this instance
   */
  end(contentType, content) {
    this.raw.writeHead(this._code, { 'Content-Type': contentType });
    this.raw.end(content);
    return this;
  }

  /**
   * Check if the response has ended
   * @returns {Boolean} whether this response has ended
   */
  get ended() {
    return this.raw.finished;
  }

  plain(content) {
    return this.end('text/plain', content);
  }

  html(content) {
    return this.end('text/html', content);
  }

  css(content) {
    return this.end('text/css', content);
  }

  js(content) {
    return this.end('application/javascript', content);
  }

  json(content) {
    if (typeof content === 'object') {
      content = JSON.stringify(content);
    }

    return this.end('application/json', content);
  }

  png(content) {
    return this.end('image/png', content);
  }

  /**
   * Redirect the request to a different url
   * @param {Number} [code] the status code, 302 by default
   * @param {String} url the url to redirect to
   * @returns {Reply} this instance
   */
  redirect(code, url) {
    if (!url && typeof code === 'string') {
      url = code;
      code = 302;
    }

    this.code(code);
    this.raw.writeHead(code, { Location: url });
    this.raw.end();
    return this;
  }
}

module.exports = Reply;
