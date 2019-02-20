const { RateLimiter } = require('utils');

module.exports = (register, ctx) => {
  const master = new RateLimiter('master', ctx.redis, 100, 1000 * 60 * 60, ip => {
    ctx.models.Ban.findOneAndUpdate({ ip }, {
      $setOnInsert: { ip },
    }, { upsert: true }).exec();
  });

  register('limiters', {
    rawBin: master.createChild('api:rawBin', 1000, 1000, true),
    createBin: master.createChild('api:createBin', 10, 1000, true),
  });
};
