const { Database, RateLimiter } = require('../../utils');

const bans = new Database(require('../../models/Ban.js'));
const bins = new Database(require('../../models/Bin.js'));
module.exports.databases = {
  bans,
  bins
};

const limiters = {};
const banned = new Set();
const mainLimiter = new RateLimiter(100, 1000 * 60 * 60, async ip => {
  if (banned.has(ip)) return;
  else {
    banned.add(ip);
    await bans.createDocument({ ip });
    banned.delete(ip);
  }
});
const main = key => mainLimiter.rateLimit(key);

limiters.loadPage = new RateLimiter(500, 1000 * 60 * 15, main);
limiters.createBin = new RateLimiter(45, 1000 * 60 * 15, main);
limiters.loadAssets = new RateLimiter(10000, 1000 * 60 * 15, main);
limiters.languageTheme = new RateLimiter(1500, 1000 * 60 * 15, main);
limiters.list = new RateLimiter(200, 1000 * 60 * 15, main);

module.exports.ratelimiters = {};
for (const [key, value] of Object.entries(limiters)) {
  module.exports.ratelimiters[key] = value.middleware;
}
