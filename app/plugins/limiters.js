const { RateLimiter } = require('utils');

module.exports = (register, ctx) => {
  const masterLimiter = new RateLimiter('master', ctx.redis, 100, 1000 * 60 * 60, ip => {
    ctx.models.Ban.findOneAndUpdate({ ip }, {
      $setOnInsert: { ip },
    }, { upsert: true }).exec();
  });
  const master = key => masterLimiter.rateLimit(key);

  const limiters = {
    loadPage: new RateLimiter('loadPage', ctx.redis, 500, 1000 * 60 * 15, master),
    createBin: new RateLimiter('createBin', ctx.redis, 45, 1000 * 60 * 15, master),
    deleteBin: new RateLimiter('deleteBin', ctx.redis, 200, 1000 * 60 * 15, master),
    loadAssets: new RateLimiter('loadAssets', ctx.redis, 10000, 1000 * 60 * 15, master),
    languageTheme: new RateLimiter('languageTheme', ctx.redis, 1500, 1000 * 60 * 15, master),
    list: new RateLimiter('list', ctx.redis, 200, 1000 * 60 * 15, master),
  };

  const middleware = {};
  for (const [key, value] of Object.entries(limiters)) {
    middleware[key] = value.middleware;
  }

  register('limiters', middleware);
};
