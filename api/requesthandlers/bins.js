const { Methods } = require('utils');

module.exports = (router, ratelimiters, models) => {
  router.get(/^bin\/([a-f0-9]{10})(\.[a-zA-Z0-9]+)?$/, ratelimiters.rawBin, async (res, data) => {
    const bin = await models.Bin
      .findOne({ key: data.matches[1] })
      .select('-__v -_id')
      .exec();

    res.json(200, bin);
  });

  router.post('/bin', ratelimiters.createBin, async (res, data) => {
    if (typeof data.buffer !== 'string') return res.json(400, { error: 'Expected a string' });
    else if (!data.buffer.length) return res.json(400, { error: 'Can\'t save an empty string' });
    else if (data.buffer.length > 100000) return res.json(400, { error: 'String is too long, max 100.000' });

    const key = Methods.generateKey();
    await new models.Bin({ key, code: data.buffer }).save();

    return res.json(200, { key });
  });
};
