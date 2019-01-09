/* global describe it */
/* eslint-disable no-await-in-loop */

const assert = require('assert').strict;

const { RouterMock, ServerResponseMock } = require('./mocks.js');
const routerMock = new RouterMock();

const { ratelimiters, databases } = require('../../requesthandlers/globals');
require('../../requesthandlers/assets.js')(routerMock, ratelimiters, databases);

describe('assets', () => {
  describe('/logo.png', () => {
    const handlers = routerMock.routes.get('/logo.png');

    it('returns a 200', async () => {
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, {}, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'image/png');
    });
  });

  describe('/assets', () => {
    it('returns a 200 when file exists and javascript content type', async () => {
      const { handlers, matches } = routerMock.routes.get('/assets/homepage/source.js');

      const res = new ServerResponseMock();
      for (const handler of handlers) {
        await handler(res, { matches }, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'application/javascript');
    });

    it('returns a 200 when file exists and css content type', async () => {
      const { handlers, matches } = routerMock.routes.get('/assets/homepage/css/master.css');

      const res = new ServerResponseMock();
      for (const handler of handlers) {
        await handler(res, { matches }, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'text/css');
    });

    it('returns a 400 when file does not exist', async () => {
      const { handlers, matches } = routerMock.routes.get('/assets/homepage/unknown.js');

      const res = new ServerResponseMock();
      for (const handler of handlers) {
        await handler(res, { matches }, () => null);
      }

      assert.equal(res.statusCode, 400);
      assert.equal(res.getHeader('content-type'), 'application/json');
    });
  });

  describe('/language', () => {
    const handlers = routerMock.routes.get('/language');

    it('returns a 400 when search is missing', async () => {
      const res = new ServerResponseMock();
      for (const handler of handlers) {
        await handler(res, { query: {} }, () => null);
      }

      assert.equal(res.statusCode, 400);
      assert.equal(res.getHeader('content-type'), 'application/json');
    });

    it('returns a 404 when language is not found', async () => {
      const res = new ServerResponseMock();
      for (const handler of handlers) {
        await handler(res, { query: { search: 'unknown' } }, () => null);
      }

      assert.equal(res.statusCode, 404);
      assert.equal(res.getHeader('content-type'), 'application/json');
    });

    it('returns a 200 when language is found', async () => {
      const res = new ServerResponseMock();
      for (const handler of handlers) {
        await handler(res, { query: { search: 'JavaScript' } }, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'application/json');
    });
  });

  describe('/theme', () => {
    const handlers = routerMock.routes.get('/theme');

    it('returns a 400 when search is missing', async () => {
      const res = new ServerResponseMock();
      for (const handler of handlers) {
        await handler(res, { query: {} }, () => null);
      }

      assert.equal(res.statusCode, 400);
      assert.equal(res.getHeader('content-type'), 'application/json');
    });

    it('returns a 404 when theme is not found', async () => {
      const res = new ServerResponseMock();
      for (const handler of handlers) {
        await handler(res, { query: { search: 'unknown' } }, () => null);
      }

      assert.equal(res.statusCode, 404);
      assert.equal(res.getHeader('content-type'), 'application/json');
    });

    it('returns a 200 when theme is found', async () => {
      const res = new ServerResponseMock();
      for (const handler of handlers) {
        await handler(res, { query: { search: 'Material' } }, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'application/json');
    });
  });
});
