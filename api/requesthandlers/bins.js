module.exports = (router, ratelimiters, models) => {
  router.get(/^bin\/([a-f0-9]{10})(\.[a-zA-Z0-9]+)?$/, ratelimiters.rawBin, async (res, data) => {
    const bin = await models.Bin
      .findOne({ key: data.matches[1] })
      .select('-__v -_id')
      .exec();

    res.json(200, bin);
  });
};
