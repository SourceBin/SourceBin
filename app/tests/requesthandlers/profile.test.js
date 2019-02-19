/* global describe it ctx */

const assert = require('assert').strict;

const { RouterMock, RequestMock, ReplyMock } = require('./mocks.js');
const router = new RouterMock(ctx);

require('../../routes/profile.js')(router.route.bind(router), ctx);

describe('profile', () => {
  describe('/profile', () => {
    const route = router.getRoute('/profile');

    it('returns a 200 when user info is missing', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.user = {};

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'text/html');
    });

    it('returns a 200 when user info is provided and owns bins', async () => {
      await new ctx.models.Bin({ key: '0123456789', code: 'code', id: 'some_id' }).save();

      const request = new RequestMock();
      const reply = new ReplyMock();

      request.user = {
        username: 'some_user',
        discriminator: '0000',
        id: 'some_id',
        avatar: 'some_avatar',
      };

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'text/html');
    });

    it('returns a 200 when user info is provided and does not own bins', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.user = {
        username: 'some_user',
        discriminator: '0000',
        id: 'some_id',
        avatar: 'some_avatar',
      };

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'text/html');
    });
  });
});
