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
   *     return res.json({ error: 'Your IP is banned!' });
   *   }
   * });
   */
  validateIp(callback) {
    this.ipValidator = callback;
  }

  server($this, req, res) {
    const ip = (req.headers['x-forwarded-for'] || '').split(',').shift() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    if (this.ipValidator) {
      this.ipValidator(req, res, ip);
      if (res.finished) return;
    }

    const method = req.method.toLowerCase();
    const routes = $this.routes.get(method);
    if (!routes) {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: `The request method ${method.toUpperCase()} is not accepted` }));
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    let matches = null;
    const route = routes.find(({ path: routePath }) => {
      if (typeof routePath === 'string') return path === routePath;
      else return matches = path.match(routePath);
    });
    if (!route) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: `The requested URL /${path} was not found` }));
    }
    const query = parsedUrl.query;
    const headers = req.headers;
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', data => buffer += decoder.write(data));
    req.on('end', () => {
      buffer += decoder.end();
      const data = { ip, method, path, query, headers, buffer, matches };
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
      this.server(this, ...params);
    }).listen(port, callback);
  }

}
module.exports = Router;

// const router = new Router();
// const RateLimiter = require('../RateLimiter.js');
// const limiter = new RateLimiter(5, 5000);
//
// router.validateIp((req, res, ip) => {
//   if (!/^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|$)){4}$/.test(ip) && ip !== '::1') {
//     return res.json(400, { error: 'Your IP doesn\'t look like a real IP' });
//   }
// });
//
// router.get('static', limiter.middleware, (res, data, next) => {
//   res.setHeader('test', true);
//   next();
// }, (res, data, next) => {
//   res.json(200, data);
//   next();
// });
//
// router.get(/^([a-f0-9]{8})(\.[a-zA-Z0-9]+)?$/, (res, data) => {
//   return res.json(200, data);
// });
//
// router.listen(3000, () => console.log('HTTP server listening on port 3000'));
