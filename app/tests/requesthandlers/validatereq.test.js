/* global describe it */
/* eslint-disable no-await-in-loop */

const assert = require('assert').strict;

const { RouterMock, ServerResponseMock } = require('./mocks.js');
const routerMock = new RouterMock();

const { ratelimiters, databases } = require('../../requesthandlers/globals');
require('../../requesthandlers/validatereq.js')(routerMock, ratelimiters, databases);

describe('validatereq', () => {
  const handler = routerMock.validateReq;

  it('has not finished response and set auth to the ip', async () => {
    const res = new ServerResponseMock();
    const data = { ip: 'some_ip', cookies: {} };
    await handler({}, res, data);

    assert.equal(data.auth, data.ip);
    assert(!res.finished);
  });

  it('returns a 403 when ip is banned', async () => {
    await databases.bans.createDocument({ ip: 'some_ip' });

    const res = new ServerResponseMock();
    await handler({}, res, { ip: 'some_ip', cookies: {} });

    assert.equal(res.statusCode, 403);
    assert.equal(res.getHeader('content-type'), 'application/json');
  });

  it('returns a 403 when id is banned', async () => {
    await databases.bans.createDocument({ ip: 'some_id' });

    const res = new ServerResponseMock();
    await handler({}, res, { ip: 'some_ip', cookies: { access_token: 'access' } });

    assert.equal(res.statusCode, 403);
    assert.equal(res.getHeader('content-type'), 'application/json');
  });

  it('has not finished response when ip is banned but id is not', async () => {
    await databases.bans.createDocument({ ip: 'some_ip' });

    const res = new ServerResponseMock();
    await handler({}, res, { ip: 'some_ip', cookies: { access_token: 'access' } });

    assert(!res.finished);
  });

  it('has not finished response and has user data', async () => {
    const res = new ServerResponseMock();
    const data = { ip: 'some_ip', cookies: { access_token: 'access' } };

    await handler({}, res, data);

    assert.equal(data.auth, 'some_id');
    assert(!res.finished);
  });

  it('has not finished response and does not use user data', async () => {
    const res = new ServerResponseMock();
    const data = { ip: 'some_ip', cookies: { access_token: 'invalid' } };

    await handler({}, res, data);

    assert.equal(data.auth, 'some_ip');
    assert(!res.finished);
  });

  it('has not finished response and refreshed the token', async () => {
    const res = new ServerResponseMock();
    const data = { ip: 'some_ip', cookies: { refresh_token: 'refresh' } };

    await handler({}, res, data);

    assert.equal(data.auth, 'some_id');
    assert.equal(data.cookies.access_token, 'access');
    assert(!res.finished);
  });

  it('has not finished response when refresh token is invalid', async () => {
    const res = new ServerResponseMock();
    const data = { ip: 'some_ip', cookies: { refresh_token: 'invalid' } };

    await handler({}, res, data);

    assert.equal(data.auth, 'some_ip');
    assert(!data.cookies.access_token);
    assert(!res.finished);
  });
});
