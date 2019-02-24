const { StringDecoder } = require('string_decoder');
const url = require('url');

const Request = require('./Request.js');
const Reply = require('./Reply.js');

module.exports = router => {
  async function handleRequest(request, reply) {
    // Find a possible route
    const route = router._routes
      .filter(route => route.method === request.method)
      .find(route => {
        if (route.path instanceof RegExp) {
          request.matches = request.path.match(route.path);
          return !!request.matches;
        } else {
          return route.path === request.path;
        }
      });

    // 404 if there is no route
    if (!route) {
      if (router._on404) {
        router._on404(request, reply, router._ctx);
      } else {
        reply.code(404).json({ error: '404 not found' });
      }
      return;
    }

    // Before each handler
    if (router._beforeEach) {
      await router._beforeEach(request, reply, router._ctx);
    }

    // Call all middleware
    if (!reply.ended && route.middleware) {
      for (const middleware of route.middleware) {
        await middleware(request, reply); // eslint-disable-line no-await-in-loop

        if (reply.ended) {
          break;
        }
      }
    }

    // Call the handler
    if (!reply.ended) {
      await route.handler(request, reply);
    }

    // After each handler
    if (router._afterEach) {
      await router._afterEach(request, reply, router._ctx);
    }
  }

  return function handler(request, response) {
    // Parse url
    const parsedUrl = url.parse(request.url, true);
    const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    const query = parsedUrl.query;

    // Parse info
    const method = request.method.toLowerCase();
    const headers = request.headers;

    // Parse cookies
    const cookies = {};
    if (request.headers.cookie) {
      request.headers.cookie.split(';')
        .map(cookie => cookie.trim().split('='))
        .forEach(cookie => {
          cookies[cookie[0]] = cookie[1];
        });
    }

    // Parse IP
    const ip = (request.headers['x-real-ip'] ||
      (request.headers['x-forwarded-for'] || '').split(',').pop() ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.connection.socket.remoteAddress).trim();

    // Parse body
    const decoder = new StringDecoder('utf-8');
    let body = '';
    request
      .on('data', chunk => {
        body += decoder.write(chunk);
      })
      .on('end', () => {
        body += decoder.end();

        handleRequest(
          new Request(request, path, query, method, headers, cookies, ip, body),
          new Reply(response),
        );
      });
  };
};
