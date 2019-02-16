const { Methods: { createCookie }, Discord } = require('utils');
const url = require('url');

const config = require('../config.json');
const discord = new Discord(config.oauth2.uri, config.oauth2.client_secret);

const oauth2 = url.parse(config.oauth2.uri, true);
const redirect_uri = oauth2.query.redirect_uri;
const authorizePath = url.parse(redirect_uri).pathname;

module.exports = router => {
  router.get(authorizePath, async (res, data) => {
    if (!data.query.code) return res.json(400, { error: 'Invalid request' });

    const tokens = await discord.exchangeCode(data.query.code);
    if (tokens.error) return res.json(400, tokens);

    discord.setTokens(res, tokens);
    return res.redirect(302, '/');
  });

  router.get('/logout', res => {
    const cookies = [
      createCookie('access_token', '', { expires: new Date(0) }),
      createCookie('refresh_token', '', { expires: new Date(0) }),
    ];
    res.setHeader('Set-Cookie', [...res.getHeader('Set-Cookie') || [], ...cookies]);
    return res.redirect(302, '/');
  });
};
