const { RateLimiter } = require('utils');

module.exports = (register, ctx) => {
  const masterLimiter = new RateLimiter('master', ctx.redis, 100, 1000 * 60 * 60, ip => {
    ctx.models.Ban.findOneAndUpdate({ ip }, {
      $setOnInsert: { ip },
    }, { upsert: true }).exec();
  });
  const master = key => masterLimiter.rateLimit(key);

  const limiters = {
    rawBin: new RateLimiter('api:rawBin', ctx.redis, 1000, 1000, master),
    createBin: new RateLimiter('api:createBin', ctx.redis, 100, 1000, master),
  };

  const middleware = {};
  for (const [key, value] of Object.entries(limiters)) {
    middleware[key] = value.middleware;
  }

  register('limiters', middleware);
};
