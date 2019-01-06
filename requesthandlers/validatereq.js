const {
  Cache: { CacheMap, CacheSet },
  Discord: { getUser, refreshToken, setTokens },
} = require('../utils');

const discordCache = new CacheMap(1000 * 60);
const noCheckCache = new CacheSet(1000);
const bannedCache = new CacheSet(1000 * 60 * 30);

module.exports = (router, _, { bans }) => {
  router.validateReq(async (_, res, data) => {
    // Refresh access token when expired
    if (!data.cookies.access_token && data.cookies.refresh_token) {
      const tokens = await refreshToken(data.cookies.refresh_token);
      if (!tokens.error) {
        data.cookies.access_token = tokens.access_token;
        setTokens(res, tokens);
      }
    }

    // Get the user object from discord
    data.auth = data.ip;
    data.user = {};
    if (data.cookies.access_token) {
      if (discordCache.has(data.cookies.access_token)) {
        const user = discordCache.get(data.cookies.access_token);

        data.user = user;
        data.auth = user.id;
      } else {
        const user = await getUser(data.cookies.access_token);

        if (user.code !== 0) {
          discordCache.set(data.cookies.access_token, user);

          data.user = user;
          data.auth = user.id;
        }
      }
    }

    // Check for bans
    if (bannedCache.has(data.auth)) {
      res.json(403, { error: 'IP adress rejected' });
      return;
    }

    if (!noCheckCache.has(data.auth)) {
      try {
        const ban = await bans.findOne({ ip: data.auth });

        if (ban) {
          bannedCache.add(data.auth);
          res.json(403, { error: 'IP adress rejected' });
        } else {
          noCheckCache.add(data.auth);
        }
      } catch (err) {
        res.json(500, { error: 'Unknown error' });
      }
    }
  });
};
