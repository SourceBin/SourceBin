const fs = require('fs');
const { Methods: { escapeHtml }, Converter: { convert } } = require('../utils');

module.exports = (router, limiters, { bins }) => {
  const profile = fs.readFileSync('./html/profile/account/index.html').toString();
  const noAccount = convert(fs.readFileSync('./html/profile/noaccount/index.html').toString(), {
    oauth2: require('../config.json').oauth2.uri,
  });

  router.get('/profile', limiters.loadPage, async (res, data) => {
    if (!data.user.username) return res.html(200, noAccount);

    const bin = await bins.model.find({ id: data.user.id }).select('key -_id').exec();
    const avatar = data.user.avatar ?
      `avatars/${data.user.id}/${data.user.avatar}.${data.user.avatar.startsWith('a_') ? 'gif' : 'png'}` :
      `embed/avatars/${data.user.discriminator % 5}.png`;

    return res.html(200, convert(profile, {
      username: escapeHtml(`${data.user.username}#${data.user.discriminator}`),
      id: data.user.id,
      avatar: avatar,
      bins: `[${bin.map(bin => `'${bin.key}'`).join(',')}]`,
    }));
  });
};
