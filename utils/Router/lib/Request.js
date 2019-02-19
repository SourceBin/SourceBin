const { performance: { now } } = require('perf_hooks');

class Request {
  constructor(raw, path, query, method, headers, cookies, ip, body) {
    /**
     * The original HTTP request object
     * @type {IncomingMessage}
     */
    this.raw = raw;

    /**
     * The path of the incoming request
     * @type {String}
     */
    this.path = path;

    /**
     * The querystring parameters
     * @type {Object}
     */
    this.query = query;

    /**
     * The HTTP request method
     * @type {String}
     */
    this.method = method;

    /**
     * The HTTP headers of the request
     * @type {Object}
     */
    this.headers = headers;

    /**
     * The cookies from the request
     * @type {Object}
     */
    this.cookies = cookies;

    /**
     * The IP from the request
     * @type {String}
     */
    this.ip = ip;

    /**
     * The body of the incoming request
     * @type {String}
     */
    this.body = body;

    /**
     * The matches with the path, if the path is a regex
     * @type {?Array}
     */
    this.matches = null;

    /**
     * The time of the incoming request
     * @type {Number}
     */
    this.start = now();
  }
}

module.exports = Request;
