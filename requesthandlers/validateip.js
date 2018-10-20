module.exports = (router, _, { bans }) => {
  router.validateIp(async (req, res, ip) => {
    try {
      const ban = await bans.findOne({ ip });
      if (ban) return res.json(403, { error: 'IP adress rejected' });
    } catch (err) {
      return res.json(500, { error: 'Unknown error' });
    };
  });
}
