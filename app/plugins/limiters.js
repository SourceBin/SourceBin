const { RateLimiter } = require('utils');

module.exports = (register, ctx) => {
  const master = new RateLimiter('master', ctx.redis, 100, 1000 * 60 * 60, ip => {
    ctx.models.Ban.updateOne({ ip }, {
      $setOnInsert: { ip },
    }, { upsert: true }).exec();
  });

  register('limiters', {
    loadPage: master.createChild('loadPage', 500, 1000 * 60 * 15),
    createBin: master.createChild('createBin', 45, 1000 * 60 * 15),
    deleteBin: master.createChild('deleteBin', 200, 1000 * 60 * 15),
    loadAssets: master.createChild('loadAssets', 10000, 1000 * 60 * 15),
    languageTheme: master.createChild('languageTheme', 1500, 1000 * 60 * 15),
  });
};
