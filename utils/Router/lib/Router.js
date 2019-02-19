const cluster = require('cluster');
const fs = require('fs');
const http = require('http');
const path = require('path');

function spawnWorker() {
  const worker = cluster.fork();
  worker.on('message', message => console.log(message));
}

/**
 * Router to handle incoming HTTP requests
 */
class Router {
  /**
   * Create a new router instance
   */
  constructor() {
    this._ctx = {};
    this._routes = [];

    this._register = require('./Register.js')(this);
    this._route = require('./Route.js')(this);
    this._handler = require('./Handler.js')(this);

    this._beforeEach = null;
    this._afterEach = null;
    this._on404 = null;
  }

  /**
   * Register plugins
   * @param {String} id path to file or directory
   * @returns {Router} this instance
   */
  register(id) {
    const src = path.join(process.cwd(), id);

    if (fs.lstatSync(src).isDirectory()) {
      fs
        .readdirSync(src)
        .map(file => require(path.join(src, file)))
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        .forEach(plugin => plugin(this._register, this._ctx));
    } else {
      require(src)(this._register, this._ctx);
    }

    return this;
  }

  /**
   * Load routes
   * @param {String} id path to file or directory
   * @returns {Router} this instance
   */
  load(id) {
    const src = path.join(process.cwd(), id);

    if (fs.lstatSync(src).isDirectory()) {
      fs
        .readdirSync(src)
        .map(file => require(path.join(src, file)))
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        .forEach(route => route(this._route, this._ctx));
    } else {
      require(src)(this._route, this._ctx);
    }

    return this;
  }

  /**
   * Called before route middleware and handlers are called
   * @param {Function} callback the function to execute
   * @returns {Router} this instance
   */
  beforeEach(callback) {
    this._beforeEach = callback;
    return this;
  }

  /**
   * Called after route middleware and handlers are called
   * @param {Function} callback the function to execute
   * @returns {Router} this instance
   */
  afterEach(callback) {
    this._afterEach = callback;
    return this;
  }

  /**
   * Called when no route was found
   * @param {Function} callback the function to execute
   * @returns {Router} this instance
   */
  on404(callback) {
    this._on404 = callback;
    return this;
  }

  /**
   * Listen on a port
   * @param {Number} port port to listen on
   * @param {Object} [options] options object
   * @param {Number} [options.instances] number of instances (will run as a cluster)
   * @param {Function} [options.callback] callback to run when started
   * @returns {Router} this instance
   */
  listen(port, options = {}) {
    if (options.instances && cluster.isMaster) {
      console.log(`Master '${process.pid}' is running`);

      for (let i = 0; i < options.instances; i++) {
        spawnWorker();
      }

      cluster.on('online', worker => console.log(`Worker '${worker.process.pid}' started`));
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker '${worker.process.pid}' died with code '${code}', and signal '${signal}'`);

        console.log('Starting a new worker');
        spawnWorker();
      });
    } else {
      http
        .createServer((request, response) => {
          this._handler(request, response);
        })
        .listen(port, options.callback);
    }

    return this;
  }
}

module.exports = Router;
