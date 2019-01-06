const { RateLimiter } = require('../../utils');
const { bans } = require('./databases.js');

const limiters = {};

const banned = new Set();
const mainLimiter = new RateLimiter(100, 1000 * 60 * 60, async ip => {
  if (!banned.has(ip)) {
    banned.add(ip);
    await bans.createDocument({ ip });
    banned.delete(ip);
  }
});
const main = key => mainLimiter.rateLimit(key);

limiters.loadPage = new RateLimiter(500, 1000 * 60 * 15, main);
limiters.createBin = new RateLimiter(45, 1000 * 60 * 15, main);
limiters.deleteBin = new RateLimiter(200, 1000 * 60 * 15, main);
limiters.loadAssets = new RateLimiter(10000, 1000 * 60 * 15, main);
limiters.languageTheme = new RateLimiter(1500, 1000 * 60 * 15, main);
limiters.list = new RateLimiter(200, 1000 * 60 * 15, main);

module.exports = {};
for (const [key, value] of Object.entries(limiters)) {
  module.exports[key] = value.middleware;
}
