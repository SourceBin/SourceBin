const { Methods } = require('../utils');

module.exports = (router, limiters, { bins }) => {

  router.post('/bin', limiters.createBin, (res, data) => {
    if (typeof data.buffer !== 'string') return res.json(400, { error: 'Expected a string' });
    else if (!data.buffer.length) return res.json(400, { error: 'Can\'t save an empty string' });
    else if (data.buffer.length > 100000) return res.json(400, { error: 'String is too long, max 100.000' });

    const key = Methods.generateKey();
    if (data.user.id) bins.createDocument({ key, code: data.buffer, id: data.user.id });
    else bins.createDocument({ key, code: data.buffer });
    return res.json(200, { key });
  });

  router.delete('/bin', limiters.deleteBin, async (res, data) => {
    const bin = await bins.findOneAndDelete({ key: data.buffer, id: data.user.id });
    if (bin) return res.json(200, { message: 'Success' });
    else return res.json(400, { error: 'Bin does not exist, or you have no permission to delete it' });
  });

  router.get('/list', limiters.list, res => {
    bins.find().then(bins => {
      const keys = bins.map(bin => bin.key);
      return res.json(200, keys);
    });
  });
}
