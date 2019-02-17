module.exports = models => {
  const redis = require('redis').createClient(process.env.REDIS_URL);
  const { RateLimiter } = require('utils');

  const masterLimiter = new RateLimiter('master', redis, 100, 1000 * 60 * 60, ip => {
    models.Ban.findOneAndUpdate({ ip }, {
      $setOnInsert: { ip },
    }, { upsert: true }).exec();
  });
  const master = key => masterLimiter.rateLimit(key);

  const limiters = {
    rawBin: new RateLimiter('api:rawBin', redis, 1000, 1000, master),
    createBin: new RateLimiter('api:createBin', redis, 100, 1000, master),
  };

  const middleware = {};
  for (const [key, value] of Object.entries(limiters)) {
    middleware[key] = value.middleware;
  }

  return middleware;
};
