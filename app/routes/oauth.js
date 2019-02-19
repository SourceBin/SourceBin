const { Methods: { createCookie }, Discord } = require('utils');
const url = require('url');

const config = require('../config.json');
const discord = new Discord(config.oauth2.uri, config.oauth2.client_secret);

const oauth2 = url.parse(config.oauth2.uri, true);
const redirect_uri = oauth2.query.redirect_uri;
const authorizePath = url.parse(redirect_uri).pathname;

module.exports = route => {
  route({
    method: 'GET',
    path: authorizePath,
    async handler(request, reply) {
      if (!request.query.code) {
        reply.code(400).json({ error: 'Invalid request' });
        return;
      }

      const tokens = await discord.exchangeCode(request.query.code);
      if (tokens.error) {
        reply.code(400).json(tokens);
        return;
      }

      discord.setTokens(reply, tokens);
      reply.redirect('/');
    },
  });

  route({
    method: 'GET',
    path: '/logout',
    handler(_, reply) {
      const cookies = [
        createCookie('access_token', '', { expires: new Date(0) }),
        createCookie('refresh_token', '', { expires: new Date(0) }),
      ];

      reply.header('Set-Cookie', [...reply.getHeader('Set-Cookie') || [], ...cookies]);
      reply.redirect('/');
    },
  });
};
