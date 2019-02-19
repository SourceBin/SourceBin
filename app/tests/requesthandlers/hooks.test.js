/* global describe it ctx */

const assert = require('assert').strict;

const { RouterMock, RequestMock, ReplyMock } = require('./mocks.js');
const router = new RouterMock(ctx);

require('../../hooks.js')(router);

describe('hooks', () => {
  describe('beforeEach', () => {
    const beforeEach = router.getBeforeEach();

    it('has not finished response and set auth to the ip', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.ip = 'some_ip';
      request.cookies = {};

      await beforeEach(request, reply, ctx);

      assert.equal(request.auth, request.ip);
      assert(!reply.ended);
    });

    it('returns a 403 when ip is banned', async () => {
      await new ctx.models.Ban({ ip: 'some_ip' }).save();

      const request = new RequestMock();
      const reply = new ReplyMock();

      request.ip = 'some_ip';
      request.cookies = {};

      await beforeEach(request, reply, ctx);

      assert.equal(reply.getCode(), 403);
      assert.equal(reply.getHeader('content-type'), 'application/json');
      assert(reply.ended);
    });

    it('returns a 403 when id is banned', async () => {
      await new ctx.models.Ban({ ip: 'some_id' }).save();

      const request = new RequestMock();
      const reply = new ReplyMock();

      request.ip = 'some_ip';
      request.cookies = { access_token: 'access' };

      await beforeEach(request, reply, ctx);

      assert.equal(reply.getCode(), 403);
      assert.equal(reply.getHeader('content-type'), 'application/json');
      assert(reply.ended);
    });

    it('has not finished response when ip is banned but id is not', async () => {
      await new ctx.models.Ban({ ip: 'some_ip' }).save();

      const request = new RequestMock();
      const reply = new ReplyMock();

      request.ip = 'some_ip';
      request.cookies = { access_token: 'access' };

      await beforeEach(request, reply, ctx);

      assert(!reply.ended);
    });

    it('has not finished response and has user data', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.ip = 'some_ip';
      request.cookies = { access_token: 'access' };

      await beforeEach(request, reply, ctx);

      assert.equal(request.auth, 'some_id');
      assert(!reply.ended);
    });

    it('has not finished response and does not use user data', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.ip = 'some_ip';
      request.cookies = { access_token: 'invalid' };

      await beforeEach(request, reply, ctx);

      assert.equal(request.auth, 'some_ip');
      assert(!reply.ended);
    });

    it('has not finished response and refreshed the token', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.ip = 'some_ip';
      request.cookies = { refresh_token: 'refresh' };

      await beforeEach(request, reply, ctx);

      assert.equal(request.auth, 'some_id');
      assert.equal(request.cookies.access_token, 'access');
      assert(!reply.ended);
    });

    it('has not finished response when refresh token is invalid', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.ip = 'some_ip';
      request.cookies = { refresh_token: 'invalid' };

      await beforeEach(request, reply, ctx);

      assert.equal(request.auth, 'some_ip');
      assert(!request.cookies.access_token);
      assert(!reply.ended);
    });
  });

  describe('on404', () => {
    const on404 = router.getOn404();

    it('returns 404 and html', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.method = 'get';
      request.path = '404';

      await on404(request, reply, ctx);

      assert.equal(reply.getCode(), 404);
      assert.equal(reply.getHeader('content-type'), 'text/html');
    });
  });
});
