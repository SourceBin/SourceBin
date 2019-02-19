/* global describe it ctx */

const assert = require('assert').strict;

const { RouterMock, RequestMock, ReplyMock } = require('./mocks.js');
const router = new RouterMock(ctx);

require('../../routes/homepage.js')(router.route.bind(router), ctx);

describe('homepage', () => {
  describe('/', () => {
    const route = router.getRoute('/');

    it('returns a 200', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'text/html');
    });
  });

  describe('/bin_code', () => {
    it('returns a 200 when bin does not exist without extension', async () => {
      const { route, matches } = router.getRoute('/0123456789');
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.matches = matches;

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'text/html');
    });

    it('returns a 200 when bin does not exist with extension', async () => {
      const { route, matches } = router.getRoute('/0123456789.js');
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.matches = matches;

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'text/html');
    });

    it('returns a 200 when bin exists without extension', async () => {
      await new ctx.models.Bin({ key: '0123456789', code: 'code' }).save();

      const { route, matches } = router.getRoute('/0123456789');
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.matches = matches;

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'text/html');
    });

    it('returns a 200 when bin exists with extension', async () => {
      await new ctx.models.Bin({ key: '0123456789', code: 'code' }).save();

      const { route, matches } = router.getRoute('/0123456789.js');
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.matches = matches;

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'text/html');
    });
  });
});
