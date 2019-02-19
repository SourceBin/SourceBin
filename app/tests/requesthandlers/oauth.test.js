/* global describe it ctx */

const assert = require('assert').strict;

const { RouterMock, RequestMock, ReplyMock } = require('./mocks.js');
const router = new RouterMock(ctx);

require('../../routes/oauth.js')(router.route.bind(router), ctx);

describe('oauth', () => {
  describe('/authorize', () => {
    const url = require('url');
    const config = require('../../config.json');

    const oauth2 = url.parse(config.oauth2.uri, true);
    const redirect_uri = oauth2.query.redirect_uri;
    const authorizePath = url.parse(redirect_uri).pathname;

    const route = router.getRoute(authorizePath);

    it('returns a 400 when code is missing', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.query = {};

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 400);
      assert.equal(reply.getHeader('content-type'), 'application/json');
    });

    it('returns a 400 when the token exchange fails', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.query = { code: 'wrong_code' };

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 400);
      assert.equal(reply.getHeader('content-type'), 'application/json');
    });

    it('returns a 302 when the exchange goes well', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.query = { code: 'good_code' };

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 302);
      assert.equal(reply.getHeader('Location'), '/');
    });
  });

  describe('/logout', () => {
    const route = router.getRoute('/logout');

    it('sets the cookies and redirects to index', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 302);
      assert.equal(reply.getHeader('Location'), '/');
      assert.deepEqual(reply.getHeader('set-cookie'), [
        'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/',
        'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/',
      ]);
    });
  });
});
