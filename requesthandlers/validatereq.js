const { Discord: { getUser, refreshToken, setTokens } } = require('../utils');

module.exports = (router, _, { bans }) => {
  router.validateReq(async (_, res, data) => {

    // Refresh access token when expired
    if (!data.cookies.access_token && data.cookies.refresh_token) {
      const tokens = await refreshToken(data.cookies.refresh_token);
      if (!tokens.error) {
        data.cookies.access_token = tokens.access_token;
        setTokens(res, tokens);
      }
    }

    // Get the user object from discord
    let auth = data.ip;
    data.user = {};
    if (data.cookies.access_token) {
      const user = await getUser(data.cookies.access_token);
      if (user.code !== 0) {
        data.user = user;
        auth = user.id;
      }
    }

    try {
      const ban = await bans.findOne({ ip: auth });
      if (ban) return res.json(403, { error: 'IP adress rejected' });
    } catch (err) {
      return res.json(500, { error: 'Unknown error' });
    };
  });
}
