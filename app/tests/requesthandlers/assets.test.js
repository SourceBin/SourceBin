/* global describe it ctx */

const assert = require('assert').strict;

const { RouterMock, RequestMock, ReplyMock } = require('./mocks.js');
const router = new RouterMock(ctx);

require('../../routes/assets.js')(router.route.bind(router), ctx);

describe('assets', () => {
  describe('/logo.png', () => {
    const route = router.getRoute('/logo.png');

    it('returns a 200 and png', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'image/png');
    });
  });

  describe('/assets', () => {
    it('returns a 200 when file exists and javascript content type', async () => {
      const { route, matches } = router.getRoute('/assets/homepage/source.js');
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.matches = matches;

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'application/javascript');
    });

    it('returns a 200 when file exists and css content type', async () => {
      const { route, matches } = router.getRoute('/assets/homepage/css/master.css');
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.matches = matches;

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'text/css');
    });

    it('returns a 400 when file does not exist', async () => {
      const { route, matches } = router.getRoute('/assets/homepage/unknown.js');
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.matches = matches;

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 400);
      assert.equal(reply.getHeader('content-type'), 'application/json');
    });
  });

  describe('/language', () => {
    const route = router.getRoute('/language');

    it('returns a 400 when search is missing', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.query = {};

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 400);
      assert.equal(reply.getHeader('content-type'), 'application/json');
    });

    it('returns a 404 when language is not found', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.query = { search: 'unknown' };

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 404);
      assert.equal(reply.getHeader('content-type'), 'application/json');
    });

    it('returns a 200 when language is found', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.query = { search: 'JavaScript' };

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'application/json');
    });
  });

  describe('/theme', () => {
    const route = router.getRoute('/theme');

    it('returns a 400 when search is missing', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.query = {};

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 400);
      assert.equal(reply.getHeader('content-type'), 'application/json');
    });

    it('returns a 404 when theme is not found', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.query = { search: 'unknown' };

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 404);
      assert.equal(reply.getHeader('content-type'), 'application/json');
    });

    it('returns a 200 when theme is found', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.query = { search: 'Material' };

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'application/json');
    });
  });
});
