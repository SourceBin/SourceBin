const { Cache: { CacheSet }, Discord, Methods } = require('utils');

const config = require('../config.json');
const discord = new Discord(config.oauth2.uri, config.oauth2.client_secret);

const noCheckCache = new CacheSet(1000);
const bannedCache = new CacheSet(1000 * 60 * 30);

module.exports = (route, ctx) => {
  const getAsync = require('util').promisify(ctx.redis.get.bind(ctx.redis));

  route.beforeEach(async (request, reply) => {
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
      const redisKey = `oauth:${request.cookies.access_token}`;
      let user = JSON.parse(await getAsync(redisKey));

      if (user) {
        request.user = user;
        request.auth = user.id;
      } else {
        user = await discord.getUser(request.cookies.access_token);

        if (user.code === 0) {
          // Remove access_token, since it's likely to be invalid
          reply.header('Set-Cookie', [
            ...reply.getHeader('Set-Cookie') || [],
            Methods.createCookie('access_token', '', { expires: new Date(0) }),
          ]);
        } else {
          ctx.redis.multi()
            .set(redisKey, JSON.stringify(user))
            .expire(redisKey, 60)
            .exec();

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
};
