const fs = require('fs');
const { Converter, Database, Methods } = require('./utils');

const languages = require('./json/languages.json');
const themes = require('./json/themes.json');
const converter = new Converter({
  languages: `[${Object.keys(languages).map(lang => `"${lang}"`)}]`,
  themes: `[${themes.map(theme => `"${theme.name}"`)}]`
});
const convert = converter.convert.bind(converter);

const bins = new Database(require('./models/Bin.js'));
const bans = new Database(require('./models/Ban.js'));

let blacklist;
bans.find().then(bans => {
  blacklist = bans.map(ban => ban.ip);
});

const { RateLimiter } = require('./utils');
const limiters = {};
limiters.mainLimiter = new RateLimiter(5, 1000 * 60 * 60, ip => {
  bans.createDocument({ ip });
  blacklist.push(ip);
});
limiters.main = key => limiters.mainLimiter.rateLimit(key);
limiters.loadPage = new RateLimiter(450, 1000 * 60 * 15, limiters.main);
limiters.createBin = new RateLimiter(15, 1000 * 60 * 15, limiters.main);
limiters.loadAssets = new RateLimiter(1200, 1000 * 60 * 15, limiters.main);
limiters.languageTheme = new RateLimiter(900, 1000 * 60 * 15, limiters.main);
limiters.list = new RateLimiter(200, 1000 * 60 * 15, limiters.main);

function init(router) {
  const homepage = fs.readFileSync('./html/index.html').toString();

  router.validateIp((req, res, ip) => {
    if (blacklist.includes(ip)) return res.json(403, { error: 'IP address rejected' });
  });

  router.get('/', limiters.loadPage.middleware, (res, data) => {
    return res.html(200, convert(homepage));
  });

  router.get(/^([a-f0-9]{10})(\.[a-zA-Z0-9]+)?$/, limiters.loadPage.middleware, (res, data) => {
    bins.findOne({ key: data.matches[1] }).then(bin => {
      if (!bin) return res.html(200, convert(homepage));
      const language = Methods.findLanguage(data.matches[2], 'extension');
      return res.html(200, convert(homepage, {
        code: bin.code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        readOnly: true,
        key: data.matches[1] ? `'${data.matches[1]}'` : null,
        language: JSON.stringify(language),
        allowSave: 'false',
        color: language && language.color ? language.color : null
      }));
    });
  });

  router.post('/bin', limiters.createBin.middleware, (res, { buffer: code }) => {
    if (typeof code !== 'string') return res.json(400, { error: 'Expected a string' });
    else if (!code.length) return res.json(400, { error: 'Can\'t save an empty string' });
    else if (code.length > 100000) return res.json(400, { error: 'String is too long, max 100.000' });
    const key = Methods.generateKey();
    bins.createDocument({ key, code });
    return res.json(200, { key });
  });

  router.get(/^assets\/(.+?\.(js|css))$/, limiters.createBin.middleware, (res, data) => {
    fs.readFile(`./html/${data.matches[1]}`, (err, content) => {
      if (err) return res.json(404, { error: 'File not found' });
      else return res[data.matches[2]](200, content);
    });
  });

  router.get('/language', limiters.languageTheme.middleware, (res, data) => {
    const { query: { search } } = data;
    if (!search) return res.json(400, { error: 'Expected a search' });
    const language = Methods.findLanguage(search, 'name');
    if (!language) return res.json(404, { error: 'No language found' });
    return res.json(200, language);
  });

  router.get('/theme', limiters.languageTheme.middleware, (res, data) => {
    const { query: { search } } = data;
    if (!search) return res.json(400, { error: 'Expected a search' });
    const theme = Methods.findTheme(search, 'name');
    if (!theme) return res.json(404, { error: 'No theme found' });
    return res.json(200, theme);
  });

  router.get('/list', limiters.list.middleware, (res, data) => {
    bins.find().then(bins => {
      const keys = bins.map(bin => bin.key);
      return res.json(200, keys);
    });
  });
}
module.exports = { init };
