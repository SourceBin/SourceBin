/* global describe it */
/* eslint-disable no-await-in-loop */

const assert = require('assert').strict;

const { RouterMock, ServerResponseMock } = require('./mocks.js');
const routerMock = new RouterMock();

const { ratelimiters, databases } = require('../../requesthandlers/globals');
require('../../requesthandlers/bins.js')(routerMock, ratelimiters, databases);

describe('bins', () => {
  describe('/bin post', () => {
    const handlers = routerMock.routes.get('/bin', 'post');

    it('returns a 400 if content is not a string', async () => {
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, { buffer: true, user: {} }, () => null);
      }

      assert.equal(res.statusCode, 400);
      assert.equal(res.getHeader('content-type'), 'application/json');
    });

    it('returns a 400 if content is an empty string', async () => {
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, { buffer: '', user: {} }, () => null);
      }

      assert.equal(res.statusCode, 400);
      assert.equal(res.getHeader('content-type'), 'application/json');
    });

    it('returns a 400 if content is longer than 100.000 chars', async () => {
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, { buffer: 't'.repeat(150000), user: {} }, () => null);
      }

      assert.equal(res.statusCode, 400);
      assert.equal(res.getHeader('content-type'), 'application/json');
    });

    it('returns a 200 and stores id', async () => {
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, { buffer: 'code', user: { id: 'some_id' } }, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'application/json');

      const { key } = JSON.parse(res.output[2]);
      const bin = await databases.bins.model.findOne({ key }).exec();

      assert.equal(bin.key, key);
      assert.equal(bin.code, 'code');
      assert.equal(bin.id, 'some_id');
    });

    it('returns a 200', async () => {
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, { buffer: 'code', user: {} }, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'application/json');

      const { key } = JSON.parse(res.output[2]);
      const bin = await databases.bins.model.findOne({ key }).exec();

      assert.equal(bin.key, key);
      assert.equal(bin.code, 'code');
      assert(!bin.id);
    });
  });

  describe('/bin delete', () => {
    const handlers = routerMock.routes.get('/bin', 'delete');

    it('returns a 200 when bin is found and deleted', async () => {
      const res = new ServerResponseMock();

      await databases.bins.createDocument({
        key: 'some_key',
        code: 'code',
        id: 'some_id',
      });

      for (const handler of handlers) {
        await handler(res, { buffer: 'some_key', user: { id: 'some_id' } }, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'application/json');

      const bins = await databases.bins.model.find().exec();
      assert.deepEqual(bins, []);
    });

    it('returns a 400 when id is not owner', async () => {
      const res = new ServerResponseMock();

      await databases.bins.createDocument({
        key: 'some_key',
        code: 'code',
        id: 'some_id',
      });

      for (const handler of handlers) {
        await handler(res, { buffer: 'some_key', user: { id: 'different_id' } }, () => null);
      }

      assert.equal(res.statusCode, 400);
      assert.equal(res.getHeader('content-type'), 'application/json');

      const bins = await databases.bins.model.find().exec();
      assert.notEqual(bins.length, 0);
    });

    it('returns a 400 when id is missing', async () => {
      const res = new ServerResponseMock();

      await databases.bins.createDocument({
        key: 'some_key',
        code: 'code',
        id: 'some_id',
      });

      for (const handler of handlers) {
        await handler(res, { buffer: 'some_key', user: {} }, () => null);
      }

      assert.equal(res.statusCode, 400);
      assert.equal(res.getHeader('content-type'), 'application/json');

      const bins = await databases.bins.model.find().exec();
      assert.notEqual(bins.length, 0);
    });

    it('returns a 400 when bin does not exist', async () => {
      const res = new ServerResponseMock();

      await databases.bins.createDocument({
        key: 'some_key',
        code: 'code',
        id: 'some_id',
      });

      for (const handler of handlers) {
        await handler(res, { buffer: 'different_key', user: { id: 'some_id' } }, () => null);
      }

      assert.equal(res.statusCode, 400);
      assert.equal(res.getHeader('content-type'), 'application/json');

      const bins = await databases.bins.model.find().exec();
      assert.notEqual(bins.length, 0);
    });

    it('returns a 400 when both key and id are not provided', async () => {
      const res = new ServerResponseMock();

      await databases.bins.createDocument({
        key: 'some_key',
        code: 'code',
        id: 'some_id',
      });

      for (const handler of handlers) {
        await handler(res, { user: {} }, () => null);
      }

      assert.equal(res.statusCode, 400);
      assert.equal(res.getHeader('content-type'), 'application/json');

      const bins = await databases.bins.model.find().exec();
      assert.notEqual(bins.length, 0);
    });
  });

  describe('/list', () => {
    const handlers = routerMock.routes.get('/list');

    it('returns a 200 and all keys', async () => {
      const res = new ServerResponseMock();

      await databases.bins.createDocument({ key: '1', code: 'code_1' });
      await databases.bins.createDocument({ key: '2', code: 'code_2' });
      await databases.bins.createDocument({ key: '3', code: 'code_3' });

      for (const handler of handlers) {
        await handler(res, {}, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'application/json');
      assert.deepEqual(JSON.parse(res.output[2]), ['1', '2', '3']);
    });
  });
});
