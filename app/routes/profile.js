const fs = require('fs');
const { Methods: { escapeHtml }, Converter: { convert }, Discord } = require('utils');

const profile = fs.readFileSync('./html/profile/account/index.html').toString();
const noAccount = convert(fs.readFileSync('./html/profile/noaccount/index.html').toString(), {
  oauth2: require('../config.json').oauth2.uri,
});

module.exports = (route, ctx) => {
  route({
    method: 'GET',
    path: '/profile',
    middleware: [ctx.limiters.loadPage],
    async handler(request, reply) {
      if (!request.user.username) {
        reply.html(noAccount);
        return;
      }

      const bin = await ctx.models.Bin.find({ id: request.user.id }).select('key -_id').exec();
      const avatar = Discord.getAvatar(request.user);

      reply.html(convert(profile, {
        username: escapeHtml(`${request.user.username}#${request.user.discriminator}`),
        id: request.user.id,
        avatar: avatar,
        bins: `[${bin.map(bin => `'${bin.key}'`).join(',')}]`,
      }));
    },
  });
};
