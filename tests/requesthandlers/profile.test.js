/* global describe it */
/* eslint-disable no-await-in-loop */

const assert = require('assert').strict;

const { RouterMock, ServerResponseMock } = require('./mocks.js');
const routerMock = new RouterMock();

const { ratelimiters, databases } = require('../../requesthandlers/globals');
require('../../requesthandlers/profile.js')(routerMock, ratelimiters, databases);

describe('profile', () => {
  describe('/profile', () => {
    const handlers = routerMock.routes.get('/profile');

    it('returns a 200 when user info is missing', async () => {
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, { user: {} }, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'text/html');
    });

    it('returns a 200 when user info is provided and owns bins', async () => {
      await databases.bins.createDocument({ key: '0123456789', code: 'code', id: 'some_id' });

      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, {
          user: {
            username: 'some_user',
            discriminator: '0000',
            id: 'some_id',
            avatar: 'some_avatar',
          },
        }, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'text/html');
    });

    it('returns a 200 when user info is provided and does not own bins', async () => {
      const res = new ServerResponseMock();

      for (const handler of handlers) {
        await handler(res, {
          user: {
            username: 'some_user',
            discriminator: '0000',
            id: 'some_id',
            avatar: 'some_avatar',
          },
        }, () => null);
      }

      assert.equal(res.statusCode, 200);
      assert.equal(res.getHeader('content-type'), 'text/html');
    });
  });
});
