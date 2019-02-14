/* global describe it */
/* eslint-disable no-await-in-loop */

const assert = require('assert').strict;

const { RouterMock, ServerResponseMock } = require('./mocks.js');
const routerMock = new RouterMock();

const { ratelimiters, databases } = require('../../requesthandlers/globals');
require('../../requesthandlers/homepage.js')(routerMock, ratelimiters, databases);

describe('homepage', () => {
  describe('/', () => {
    const handlers = routerMock.routes.get('/');

    it('returns a 200', async () => {
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, {}, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'text/html');
    });
  });

  describe('/bin_code', () => {
    it('returns a 200 when bin does not exist without extension', async () => {
      const { handlers, matches } = routerMock.routes.get('/0123456789');
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, { matches }, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'text/html');
    });

    it('returns a 200 when bin does not exist with extension', async () => {
      const { handlers, matches } = routerMock.routes.get('/0123456789.js');
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, { matches }, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'text/html');
    });

    it('returns a 200 when bin exists without extension', async () => {
      await databases.bins.createDocument({ key: '0123456789', code: 'code' });

      const { handlers, matches } = routerMock.routes.get('/0123456789');
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, { matches }, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'text/html');
    });

    it('returns a 200 when bin exists with extension', async () => {
      await databases.bins.createDocument({ key: '0123456789', code: 'code' });

      const { handlers, matches } = routerMock.routes.get('/0123456789.js');
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, { matches }, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'text/html');
    });
  });
});
