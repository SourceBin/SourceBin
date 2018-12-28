const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const methods = require('../../json/methods.json')
  .map(method => method.toLowerCase());

require('./Response.js');

class Router {

  constructor() {

    /**
     * All global callbacks
     * @type {Array<Function>}
     */
    this.globals = new Array();

    /**
     * All the routes for the app
     * @type {Map<String, Array<Object>}
     */
    this.routes = new Map();

    for (const method of methods) {
      this[method] = function(path, ...callbacks) {
        if (!path) throw new Error('path required');
        if (typeof path !== 'string' && !(path instanceof RegExp)) {
          throw new Error('path must be a string or RegExp');
        }
        if (typeof path === 'string') path = path.replace(/^\/+|\/+$/g, '');
        if (!callbacks) throw new Error('callback function required');
        for (const callback of callbacks) {
          if (typeof callback !== 'function') throw new Error('callback must be a function');
        }

        const routes = this.routes.get(method) || [];
        routes.push({ path, callbacks });
        return this.routes.set(method, routes);
      }
    }
  }

  /**
   * Add a global callback that gets executed first for every request
   * @param {...Function} callbacks The callbacks to add
   */
  use(...callbacks) {
    this.globals.push(...callbacks);
  }

  /**
   * Validate the request before continuing, used to block incoming
   * requests from banned IPs
   * @param {Function} callback The callback to execute on every request
   * If the response is completed (`response.end()` has been called) execution
   * will be cancelled
   * @example
   * Router.validateReq((req, res, data) => {
   *   if (blockedIps.includes(data.ip)) {
   *     return res.json(403, { error: 'Your IP is banned!' });
   *   }
   * });
   */
  validateReq(callback) {
    this.ipValidator = callback;
  }

  async server($this, req, res) {
    const data = {};

    data.cookies = {};
    if (req.headers.cookie) {
      req.headers.cookie.split(';')
        .map(cookie => cookie.trim().split('='))
        .forEach(cookie => data.cookies[cookie[0]] = cookie[1]);
    }

    data.ip = (req.headers['x-real-ip'] ||
      (req.headers['x-forwarded-for'] || '').split(',').pop() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress).trim();

    if (this.ipValidator) {
      await this.ipValidator(req, res, data);
      if (res.finished) return;
    }

    data.method = req.method.toLowerCase();
    const routes = this.routes.get(data.method);
    if (!routes) {
      return res.json(405, { error: `The request method ${data.method.toUpperCase()} is not accepted` });
    }

    const parsedUrl = url.parse(req.url, true);
    data.path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    data.matches = null;
    const route = routes.find(({ path }) => {
      if (typeof path === 'string') return data.path === path;
      else return data.matches = data.path.match(path);
    });
    if (!route) {
      return res.json(404, { error: `The requested URL /${data.path} was not found` });
    }
    data.query = parsedUrl.query;
    data.headers = req.headers;
    const decoder = new StringDecoder('utf-8');
    data.buffer = '';
    req.on('data', chunk => data.buffer += decoder.write(chunk));
    req.on('end', () => {
      data.buffer += decoder.end();

      console.log(`${data.ip.padEnd(35)} | ` +
        `${data.method.padEnd(6)} | ` +
        `${(data.path || '/').padEnd(40)} | ` +
        `${data.query ? JSON.stringify(data.query) : '{}'}`
      );

      let globals = 0;
      let callback = 0;

      function next() {
        let fn;
        if (globals < $this.globals.length) {
          fn = $this.globals[globals++];
        } else if (callback < route.callbacks.length) {
          fn = route.callbacks[callback++];
        }

        if (fn) {
          try {
            fn(res, data, next);
          } catch (err) {
            console.error(err);
            return res.json(500, { error: 'An unknown error occured!' });
          }
        }
      }
      next();
    });
  }

  /**
   * Starts the HTTP server listening for connections
   * Identical to `http.createServer().listen()`
   * @param {Number} port The port to use for the HTTP server
   * @param {Function} [callback] Callback for the `server.listen()` function
   */
  listen(port, callback) {
    http.createServer((...params) => {
      this.server(this, ...params);
    }).listen(port, callback);
  }

}
module.exports = Router;
