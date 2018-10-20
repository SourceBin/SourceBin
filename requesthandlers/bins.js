const { Methods } = require('../utils');

module.exports = (router, limiters, { bins }) => {

  router.post('/bin', limiters.createBin, (res, { buffer: code }) => {
    if (typeof code !== 'string') return res.json(400, { error: 'Expected a string' });
    else if (!code.length) return res.json(400, { error: 'Can\'t save an empty string' });
    else if (code.length > 100000) return res.json(400, { error: 'String is too long, max 100.000' });

    const key = Methods.generateKey();
    bins.createDocument({ key, code });
    return res.json(200, { key });
  });

  router.get('/list', limiters.list, (res, data) => {
    bins.find().then(bins => {
      const keys = bins.map(bin => bin.key);
      return res.json(200, keys);
    });
  });
}
