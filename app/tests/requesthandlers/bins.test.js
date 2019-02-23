/* global describe it ctx */

const assert = require('assert').strict;

const { RouterMock, RequestMock, ReplyMock } = require('./mocks.js');
const router = new RouterMock(ctx);

require('../../routes/bins.js')(router.route.bind(router), ctx);

describe('bins', () => {
  describe('/bin post', () => {
    const route = router.getRoute('/bin', 'post');

    it('returns a 400 if content is not a string', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.body = true;
      request.user = {};

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 400);
      assert.equal(reply.getHeader('content-type'), 'application/json');
    });

    it('returns a 400 if content is an empty string', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.body = '';
      request.user = {};

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 400);
      assert.equal(reply.getHeader('content-type'), 'application/json');
    });

    it('returns a 400 if content is longer than 100.000 chars', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.body = 't'.repeat(150000);
      request.user = {};

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 400);
      assert.equal(reply.getHeader('content-type'), 'application/json');
    });

    it('returns a 200 and stores id', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.body = 'code';
      request.user = { id: 'some_id' };

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'application/json');

      const { key } = JSON.parse(reply.raw.output[2]);
      const bin = await ctx.models.Bin.findOne({ key }).exec();

      assert.equal(bin.key, key);
      assert.equal(bin.code, 'code');
      assert.equal(bin.id, 'some_id');
    });

    it('returns a 200', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.body = 'code';
      request.user = {};

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'application/json');

      const { key } = JSON.parse(reply.raw.output[2]);
      const bin = await ctx.models.Bin.findOne({ key }).exec();

      assert.equal(bin.key, key);
      assert.equal(bin.code, 'code');
      assert(!bin.id);
    });
  });

  describe('/bin delete', () => {
    const route = router.getRoute('/bin', 'delete');

    it('returns a 200 when bin is found and deleted', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.body = 'some_key';
      request.user = { id: 'some_id' };

      await new ctx.models.Bin({
        key: 'some_key',
        code: 'code',
        id: 'some_id',
      }).save();

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 200);
      assert.equal(reply.getHeader('content-type'), 'application/json');

      const bins = await ctx.models.Bin.find().exec();
      assert.deepEqual(bins, []);
    });

    it('returns a 400 when id is not owner', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.body = 'some_key';
      request.user = { id: 'different_id' };

      await new ctx.models.Bin({
        key: 'some_key',
        code: 'code',
        id: 'some_id',
      }).save();

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 400);
      assert.equal(reply.getHeader('content-type'), 'application/json');

      const bins = await ctx.models.Bin.find().exec();
      assert.notEqual(bins.length, 0);
    });

    it('returns a 400 when id is missing', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.body = 'some_key';
      request.user = {};

      await new ctx.models.Bin({
        key: 'some_key',
        code: 'code',
        id: 'some_id',
      }).save();

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 400);
      assert.equal(reply.getHeader('content-type'), 'application/json');

      const bins = await ctx.models.Bin.find().exec();
      assert.notEqual(bins.length, 0);
    });

    it('returns a 400 when bin does not exist', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.body = 'different_key';
      request.user = { id: 'some_id' };

      await new ctx.models.Bin({
        key: 'some_key',
        code: 'code',
        id: 'some_id',
      }).save();

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 400);
      assert.equal(reply.getHeader('content-type'), 'application/json');

      const bins = await ctx.models.Bin.find().exec();
      assert.notEqual(bins.length, 0);
    });

    it('returns a 400 when both key and id are not provided', async () => {
      const request = new RequestMock();
      const reply = new ReplyMock();

      request.user = {};

      await new ctx.models.Bin({
        key: 'some_key',
        code: 'code',
        id: 'some_id',
      }).save();

      await route.handler(request, reply);

      assert.equal(reply.getCode(), 400);
      assert.equal(reply.getHeader('content-type'), 'application/json');

      const bins = await ctx.models.Bin.find().exec();
      assert.notEqual(bins.length, 0);
    });
  });
});
