const redis = require('redis').createClient(process.env.REDIS_URL);
const { RateLimiter } = require('../../utils');
const { bans } = require('./databases.js');

const masterLimiter = new RateLimiter('master', redis, 100, 1000 * 60 * 60, ip => {
  bans.model.findOneAndUpdate({ ip }, {
    $setOnInsert: { ip },
  }, { upsert: true }).exec();
});
const master = key => masterLimiter.rateLimit(key);

const limiters = {
  loadPage: new RateLimiter('loadPage', redis, 500, 1000 * 60 * 15, master),
  createBin: new RateLimiter('createBin', redis, 45, 1000 * 60 * 15, master),
  deleteBin: new RateLimiter('deleteBin', redis, 200, 1000 * 60 * 15, master),
  loadAssets: new RateLimiter('loadAssets', redis, 10000, 1000 * 60 * 15, master),
  languageTheme: new RateLimiter('languageTheme', redis, 1500, 1000 * 60 * 15, master),
  list: new RateLimiter('list', redis, 200, 1000 * 60 * 15, master),
};

module.exports = {};
for (const [key, value] of Object.entries(limiters)) {
  module.exports[key] = value.middleware;
}
