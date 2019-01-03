const fs = require('fs');
const readFile = require('util').promisify(fs.readFile);

const path = require('path');
const { Methods, Cache: { CacheMap } } = require('../utils');

const fileCache = new CacheMap();

module.exports = (router, limiters) => {
  const logo = fs.readFileSync('./html/logo.png');

  router.get('/logo.png', limiters.loadAssets, res => {
    return res.png(200, logo);
  });

  router.get(/^assets\/(.+?\.(js|css))$/, limiters.loadAssets, async (res, data) => {
    if (fileCache.has(data.matches[0])) {
      return res[data.matches[2]](200, fileCache.get(data.matches[0]));
    }

    try {
      let file = (await readFile(`./html/${data.matches[1]}`)).toString();

      if (data.matches[2] === 'js') {
        const match = file.toString().match(/^\/\/ css: (.+)$/m);

        if (match) {
          const css = (await readFile(
            path.join(`./html/${data.matches[1]}`, `../${match[1]}`)
          )).toString();

          file += `(() => {const style = document.createElement('style');style.innerHTML = \`${css}\`;document.head.appendChild(style);})();`;
        }
      }

      fileCache.set(data.matches[0], file);
      return res[data.matches[2]](200, file);
    } catch (err) {
      return res.json(400, { error: 'File not found' });
    }
  });

  router.get('/language', limiters.languageTheme, (res, data) => {
    const { query: { search } } = data;
    if (!search) return res.json(400, { error: 'Expected a search' });

    const language = Methods.findLanguage(search, 'name');
    if (!language) return res.json(404, { error: 'No language found' });

    return res.json(200, {
      name: language.name,
      ace_mode: language.ace_mode,
      extension: (language.extensions || [])[0]
    });
  });

  router.get('/theme', limiters.languageTheme, (res, data) => {
    const { query: { search } } = data;
    if (!search) return res.json(400, { error: 'Expected a search' });

    const theme = Methods.findTheme(search, 'name');
    if (!theme) return res.json(404, { error: 'No theme found' });

    return res.json(200, theme);
  });
}
