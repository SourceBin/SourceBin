const { performance: { now } } = require('perf_hooks');
const { Cache: { CacheMap, CacheSet }, Discord } = require('utils');

const config = require('./config.json');
const discord = new Discord(config.oauth2.uri, config.oauth2.client_secret);

const discordCache = new CacheMap(1000 * 60);
const noCheckCache = new CacheSet(1000);
const bannedCache = new CacheSet(1000 * 60 * 30);

module.exports = router => {
  router.beforeEach(async (request, reply, ctx) => {
    // Refresh access token when expired
    if (!request.cookies.access_token && request.cookies.refresh_token) {
      const tokens = await discord.refreshToken(request.cookies.refresh_token);

      if (!tokens.error) {
        request.cookies.access_token = tokens.access_token;
        discord.setTokens(reply, tokens);
      }
    }

    // Get the user object from discord
    request.auth = request.ip;
    request.user = {};
    if (request.cookies.access_token) {
      if (discordCache.has(request.cookies.access_token)) {
        const user = discordCache.get(request.cookies.access_token);

        request.user = user;
        request.auth = user.id;
      } else {
        const user = await discord.getUser(request.cookies.access_token);

        if (user.code !== 0) {
          discordCache.set(request.cookies.access_token, user);

          request.user = user;
          request.auth = user.id;
        }
      }
    }

    // Check for bans
    if (bannedCache.has(request.auth)) {
      reply.code(403).json({ error: 'IP adress rejected' });
      return;
    }

    if (!noCheckCache.has(request.auth)) {
      try {
        const ban = await ctx.models.Ban.findOne({ ip: request.auth }).exec();

        if (ban) {
          bannedCache.add(request.auth);
          reply.code(403).json({ error: 'IP adress rejected' });
        } else {
          noCheckCache.add(request.auth);
        }
      } catch (err) {
        reply.code(500).json({ error: 'Unknown error' });
      }
    }
  });

  router.afterEach((request, reply, ctx) => {
    ctx.log(
      `${new Date().toLocaleString('uk')} | ` +
      `${reply.getCode()} | ` +
      `${now() - request.start}ms | ` +
      `${request.method.toUpperCase()} /${request.path}`
    );
  });

  router.on404((request, reply, ctx) => {
    ctx.log('404', `${request.method.toUpperCase()} /${request.path}`);
    reply
      .code(404)
      .html(`<h1>404 /${request.path} was not found</h1>`);
  });
};
