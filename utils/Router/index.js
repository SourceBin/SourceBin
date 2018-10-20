const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const methods = require('../../json/methods.json')
  .map(method => method.toLowerCase());

require('./Response.js');

class Router {

  constructor() {
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
   * Validate the IP before continuing the request, used to block incoming
   * requests from banned IPs
   * @param {Function} callback The callback to execute on every request
   * If the response is completed (`response.end()` has been called) execution
   * will be cancelled
   * @example
   * Router.validateIp((req, res, ip) => {
   *   if (blockedIps.includes(ip)) {
   *     return res.json(403, { error: 'Your IP is banned!' });
   *   }
   * });
   */
  validateIp(callback) {
    this.ipValidator = callback;
  }

  async server(req, res) {
    const ip = (req.headers['x-forwarded-for'] || '').split(',').shift() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    if (this.ipValidator) {
      await this.ipValidator(req, res, ip);
      if (res.finished) return;
    }

    const method = req.method.toLowerCase();
    const routes = this.routes.get(method);
    if (!routes) {
      return res.json(405, { error: `The request method ${method.toUpperCase()} is not accepted` });
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    let matches = null;
    const route = routes.find(({ path: routePath }) => {
      if (typeof routePath === 'string') return path === routePath;
      else return matches = path.match(routePath);
    });
    if (!route) {
      return res.json(404, { error: `The requested URL /${path} was not found` });
    }
    const query = parsedUrl.query;
    const headers = req.headers;
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', data => buffer += decoder.write(data));
    req.on('end', () => {
      buffer += decoder.end();
      const data = { ip, method, path, query, headers, buffer, matches };

      console.log(`${ip.padEnd(35)} | ` +
        `${method.padEnd(4)} | ` +
        `${(path || '/').padEnd(40)} | ` +
        `${query ? JSON.stringify(query) : '{}'}`
      );

      let callback = 0;

      function next() {
        if (callback >= route.callbacks.length) return;
        route.callbacks[callback++](res, data, next);
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
      this.server(...params);
    }).listen(port, callback);
  }

}
module.exports = Router;
