const { default: rewiremock } = require('rewiremock/node');
rewiremock.enable();

rewiremock('redis').with(require('redis-mock'));

class DiscordMock {
  static exchangeCode(code) {
    if (code === 'wrong_code') return { error: 'wrong code' };
    else return { access_token: 'access', refresh_token: 'refresh', expires_in: 0 };
  }

  static getUser(token) {
    if (token === 'access') return { id: 'some_id' };
    else return { code: 0 };
  }

  static refreshToken(token) {
    if (token === 'refresh') return { access_token: 'access', refresh_token: 'refresh', expires_in: 0 };
    else return { error: 'something went wrong' };
  }

  static setTokens() {} // eslint-disable-line no-empty-function
}
rewiremock('../../utils/Discord.js').with(DiscordMock);

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
rewiremock('../../utils/Cache.js').with(CacheMock);

const methods = require('../../json/methods.json').map(method => method.toLowerCase());
class RouterMock {
  constructor() {
    const routes = new Map();
    this.routes = {
      get: function(path, method = 'get') {
        let match;

        const route = Array.from(routes.keys()).find(({ method: m, path: route }) => {
          if (m !== method) return false;

          if (typeof route === 'string') {
            return path === route;
          } else {
            match = path.replace(/^\/+|\/+$/g, '').match(route);
            return !!match;
          }
        });

        return match ? { handlers: routes.get(route), matches: match } : routes.get(route);
      },
    };

    for (const method of methods) {
      this[method] = (path, ...callbacks) => routes.set({ method, path }, callbacks);
    }
  }

  validateReq(callback) {
    this.validateReq = callback;
  }
}

require('../../utils/Router/Response.js');
const { ServerResponse } = require('http');
class ServerResponseMock extends ServerResponse {
  constructor(method = 'get') {
    super({ method });
    this.setHeader('__test', true);
    this.removeHeader('__test');
  }
}

module.exports = { RouterMock, ServerResponseMock };
