/* global describe it */
/* eslint-disable no-await-in-loop */

const assert = require('assert').strict;

const { RouterMock, ServerResponseMock } = require('./mocks.js');
const routerMock = new RouterMock();

const { ratelimiters, databases } = require('../../requesthandlers/globals');
require('../../requesthandlers/oauth.js')(routerMock, ratelimiters, databases);

describe('oauth', () => {
  describe('/authorize', () => {
    const url = require('url');
    const config = require('../../config.json');

    const oauth2 = url.parse(config.oauth2.uri, true);
    const redirect_uri = oauth2.query.redirect_uri;
    const authorizePath = url.parse(redirect_uri).pathname;

    const handlers = routerMock.routes.get(authorizePath);

    it('returns a 400 when code is missing', async () => {
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, { query: {} });
      }

      assert.equal(res.statusCode, 400);
      assert.equal(res.getHeader('content-type'), 'application/json');
    });

    it('returns a 400 when the token exchange fails', async () => {
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, { query: { code: 'wrong_code' } });
      }

      assert.equal(res.statusCode, 400);
      assert.equal(res.getHeader('content-type'), 'application/json');
    });

    it('returns a 302 when the exchange goes well', async () => {
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, { query: { code: 'good_code' } });
      }

      assert.equal(res.statusCode, 302);
      assert.equal(res.getHeader('Location'), '/');
    });
  });

  describe('/logout', () => {
    const handlers = routerMock.routes.get('/logout');

    it('sets the cookies and redirects to index', async () => {
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res);
      }

      assert.equal(res.statusCode, 302);
      assert.equal(res.getHeader('Location'), '/');
      assert.deepEqual(res.getHeader('set-cookie'), [
        'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/',
        'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/',
      ]);
    });
  });
});
