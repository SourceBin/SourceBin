/* global ctx */

const { default: rewiremock } = require('rewiremock/node');
rewiremock.enable();

rewiremock('redis').with(require('redis-mock'));

class DiscordMock {
  exchangeCode(code) {
    if (code === 'wrong_code') return { error: 'wrong code' };
    else return { access_token: 'access', refresh_token: 'refresh', expires_in: 0 };
  }

  getUser(token) {
    if (token === 'access') return { id: 'some_id' };
    else return { code: 0 };
  }

  refreshToken(token) {
    if (token === 'refresh') return { access_token: 'access', refresh_token: 'refresh', expires_in: 0 };
    else return { error: 'something went wrong' };
  }

  setTokens() {} // eslint-disable-line no-empty-function

  static getAvatar() {
    return 'avatar';
  }
}
rewiremock('utils/Discord.js').with(DiscordMock);

const CacheMock = {
  CacheMap: class CacheMap extends Map {
    constructor() {
      super();
      setInterval(() => this.clear(), 1);
    }
  },
  CacheSet: class CacheSet extends Set {
    constructor() {
      super();
      setInterval(() => this.clear(), 1);
    }
  },
};
rewiremock('utils/Cache.js').with(CacheMock);

class RouterMock {
  constructor(ctx) {
    this.ctx = ctx;
    this.routes = [];

    this._beforeEach = null;
    this._afterEach = null;
    this._on404 = null;
  }

  getRoute(path, method = 'get') {
    path = path.replace(/^\/+|\/+$/g, '');
    let matches;

    const route = this.routes
      .filter(route => route.method === method)
      .find(route => {
        if (route.path instanceof RegExp) {
          matches = path.match(route.path);
          return !!matches;
        } else {
          return route.path === path;
        }
      });

    return matches ? { route, matches } : route;
  }

  route(options) {
    options.method = options.method.toLowerCase();

    if (typeof options.path === 'string') {
      options.path = options.path.replace(/^\/+|\/+$/g, '');
    }

    this.routes.push(options);
  }

  static register(id) {
    let ctx = {};

    function register(name, value) {
      if (ctx[name]) {
        throw new Error(`Plugin with name "${name}" already exists`);
      }

      ctx[name] = value;
    }

    require('fs')
      .readdirSync(id)
      .forEach(plugin => {
        require(require('path').join(id, plugin))(register.bind(this), ctx);
      });

    return ctx;
  }

  beforeEach(callback) {
    this._beforeEach = callback;
  }

  getBeforeEach() {
    return this._beforeEach;
  }

  afterEach(callback) {
    this._afterEach = callback;
  }

  getAfterEach() {
    return this._afterEach;
  }

  on404(callback) {
    this._on404 = callback;
  }

  getOn404() {
    return this._on404;
  }
}

const Request = require('utils/Router/lib/Request.js');
class RequestMock extends Request {
  constructor() {
    super(new (require('http').IncomingMessage)());
  }
}

const Reply = require('utils/Router/lib/Reply.js');
class ReplyMock extends Reply {
  constructor(method = 'get') {
    super(new (require('http').ServerResponse)({ method }));
    this.header('__test', true);
    this.removeHeader('__test');
  }
}

global.ctx = RouterMock.register(require('path').join(process.cwd(), './plugins'));
ctx.log = () => null;

module.exports = { RouterMock, RequestMock, ReplyMock };
