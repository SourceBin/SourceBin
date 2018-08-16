const fs = require('fs');
const { Converter, Database, Methods } = require('./utils');

const languages = require('./json/languages.json');
const themes = require('./json/themes.json');
const converter = new Converter({
  languages: `[${Object.keys(languages).map(lang => `"${lang}"`)}]`,
  themes: `[${themes.map(theme => `"${theme.name}"`)}]`
});
const convert = converter.convert.bind(converter);

const db = new Database();

function init(router) {
  const homepage = fs.readFileSync('./html/index.html').toString();

  router.get('/', (res, data) => {
    return res.html(200, convert(homepage));
  });

  router.get(/^([a-f0-9]{8})(\.[a-zA-Z0-9]+)?$/, (res, data) => {
    db.findOne({ key: data.matches[1] }).then(bin => {
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

  router.post('/bin', (res, { buffer }) => {
    if (typeof buffer !== 'string') return res.json(400, { error: 'Expected a string' });
    else if (!buffer.length) return res.json(400, { error: 'Can\'t save an empty string' });
    else if (buffer.length > 100000) return res.json(400, { error: 'String is too long, max 100.000' });
    const key = Methods.generateKey();
    db.createModel({ key, code: buffer });
    return res.json(200, { key });
  });

  router.get(/^assets\/(.+?\.(js|css))$/, (res, data) => {
    fs.readFile(`./html/${data.matches[1]}`, (err, content) => {
      if (err) return res.json(404, { error: 'File not found' });
      else return res[data.matches[2]](200, content);
    });
  });

  router.get('/language', (res, data) => {
    const { query: { search } } = data;
    if (!search) return res.json(400, { error: 'Expected a search' });
    const language = Methods.findLanguage(search, 'name');
    if (!language) return res.json(404, { error: 'No language found' });
    return res.json(200, language);
  });

  router.get('/theme', (res, data) => {
    const { query: { search } } = data;
    if (!search) return res.json(400, { error: 'Expected a search' });
    const theme = Methods.findTheme(search, 'name');
    if (!theme) return res.json(404, { error: 'No theme found' });
    return res.json(200, theme);
  });

  router.get('/list', (res, data) => {
    db.find().then(bins => {
      const keys = bins.map(bin => bin.key);
      return res.json(200, keys);
    });
  });
}
module.exports = { init };
