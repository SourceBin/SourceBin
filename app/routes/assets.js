const fs = require('fs');
const path = require('path');
const { Methods, Cache: { CacheMap } } = require('utils');

const readFile = require('util').promisify(fs.readFile);
const fileCache = new CacheMap(process.env.PRODUCTION ? 0 : 100);
const logo = fs.readFileSync('./html/logo.png');

module.exports = (route, ctx) => {
  route({
    method: 'GET',
    path: '/logo.png',
    middleware: [ctx.limiters.loadAssets],
    handler(_, reply) {
      reply.png(logo);
    },
  });

  route({
    method: 'GET',
    path: /^assets\/(.+?\.(js|css))$/,
    middleware: [ctx.limiters.loadAssets],
    async handler(request, reply) {
      if (fileCache.has(request.matches[0])) {
        reply[request.matches[2]](fileCache.get(request.matches[0]));
        return;
      }

      try {
        let file = (await readFile(`./html/${request.matches[1]}`)).toString();

        if (request.matches[2] === 'js') {
          const match = file.match(/^\/\/ CSS: (.+)$/m);

          if (match) {
            const css = (await readFile(
              path.join(`./html/${request.matches[1]}`, `../${match[1]}`)
            )).toString();

            file += `(() => {const style = document.createElement('style');
              style.innerHTML = \`${css}\`;document.head.appendChild(style);})();`;
          }
        }

        fileCache.set(request.matches[0], file);
        reply[request.matches[2]](file);
      } catch (err) {
        reply.code(400).json({ error: 'File not found' });
      }
    },
  });

  route({
    method: 'GET',
    path: '/language',
    middleware: [ctx.limiters.languageTheme],
    handler(request, reply) {
      const { query: { search } } = request;
      if (!search) {
        reply.code(400).json({ error: 'Expected a search' });
        return;
      }

      const language = Methods.findLanguage(search, 'name');
      if (!language) {
        reply.code(404).json({ error: 'No language found' });
        return;
      }

      reply.json({
        name: language.name,
        ace_mode: language.ace_mode,
        extension: (language.extensions || [])[0],
      });
    },
  });

  route({
    method: 'GET',
    path: '/theme',
    middleware: [ctx.limiters.languageTheme],
    handler(request, reply) {
      const { query: { search } } = request;
      if (!search) {
        reply.code(400).json({ error: 'Expected a search' });
        return;
      }

      const theme = Methods.findTheme(search, 'name');
      if (!theme) {
        reply.code(404).json({ error: 'No theme found' });
        return;
      }

      reply.json(theme);
    },
  });
};
