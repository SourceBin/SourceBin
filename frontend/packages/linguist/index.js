const fs = require('fs');
const axios = require('axios');
const yaml = require('js-yaml');

const config = require('./config.json');

async function loadGithubLinguist() {
  const { data } = await axios.get(config.url);
  return yaml.safeLoad(data);
}

function getIndexFile() {
  return `
    module.exports.linguist = require('./linguist.json');
    module.exports.languages = require('./languages.json');
  `;
}

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

function writeFile(index, linguist, languages) {
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
  }

  fs.writeFileSync('./dist/index.js', index);
  fs.writeFileSync('./dist/linguist.json', JSON.stringify(linguist, null, 2));
  fs.writeFileSync('./dist/languages.json', JSON.stringify(languages, null, 2));
}

async function main() {
  const githubLinguist = await loadGithubLinguist();

  const index = getIndexFile();
  const linguist = transformLinguist(githubLinguist);
  const languages = transformLanguages(githubLinguist);

  writeFile(index, linguist, languages);
}

main();
