const fs = require('fs');
const { Engine, Methods } = require('utils');
const engine = new Engine();

const languages = require('utils/json/languages.json');
const themes = require('utils/json/themes.json');

module.exports = (router, limiters, { bins }) => {
  const homepage = engine.compile(
    fs.readFileSync('./html/homepage/index.ejs').toString(),
    ['languages', 'themes', 'bin', 'language']
  );

  // Homepage
  router.get('/', limiters.loadPage, res => res.html(200, homepage(languages, themes)));

  // Bin
  router.get(/^([a-f0-9]{10})(\.[a-zA-Z0-9]+)?$/, limiters.loadPage, async (res, data) => {
    const bin = await bins.model.findOne({ key: data.matches[1] }).exec();
    if (!bin) return res.html(200, homepage(languages, themes));

    const language = Methods.findLanguage(data.matches[2], 'extension');
    return res.html(200, homepage(languages, themes, bin, language));
  });
};
