const fs = require('fs');
const download = require('./download.js');
const config = require('../config.json');

const DIST_DIR = './dist';

const indexFile = `
  module.exports.linguist = require('./linguist.json');
  module.exports.languages = require('./languages.json');
`;

function transformLanguage(name, data) {
  return {
    name,
    aliases: data.aliases,
    aceMode: data.ace_mode,
  };
}

function transformLinguist(githubLinguist) {
  const output = {};

  for (const [name, data] of Object.entries(githubLinguist)) {
    output[data.language_id] = transformLanguage(name, data);
  }

  return output;
}

function transformLanguages(githubLinguist) {
  const output = {};

  for (const [name, data] of Object.entries(githubLinguist)) {
    output[name] = data.language_id;
  }

  return output;
}

download(config.url).then((githubLinguist) => {
  const linguist = transformLinguist(githubLinguist);
  const languages = transformLanguages(githubLinguist);

  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR);
  }

  fs.writeFileSync(`${DIST_DIR}/index.js`, indexFile);
  fs.writeFileSync(`${DIST_DIR}/linguist.json`, JSON.stringify(linguist, null, 2));
  fs.writeFileSync(`${DIST_DIR}/languages.json`, JSON.stringify(languages, null, 2));
});
