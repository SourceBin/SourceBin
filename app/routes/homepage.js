const fs = require('fs');
const { Engine, Methods } = require('utils');

const engine = new Engine();
const homepage = engine.compile(
  fs.readFileSync('./html/homepage/index.ejs').toString(),
  ['languages', 'themes', 'bin', 'language']
);

const languages = require('utils/json/languages.json');
const themes = require('utils/json/themes.json');

module.exports = (route, ctx) => {
  route({
    method: 'GET',
    path: '/',
    middleware: [ctx.limiters.loadPage],
    handler(_, reply) {
      reply.html(homepage(languages, themes));
    },
  });

  route({
    method: 'GET',
    path: /^([a-f0-9]{10})(\.[a-zA-Z0-9]+)?$/,
    middleware: [ctx.limiters.loadPage],
    async handler(request, reply) {
      const bin = await ctx.models.Bin.findOne({
        key: request.matches[1],
      }).exec();

      if (bin) {
        const language = Methods.findLanguage(request.matches[2], 'extension');
        reply.html(homepage(languages, themes, bin, language));
      } else {
        reply.html(homepage(languages, themes));
      }
    },
  });
};
