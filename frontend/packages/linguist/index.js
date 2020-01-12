const fs = require('fs');
const axios = require('axios');
const yaml = require('js-yaml');

const config = require('./config.json');

async function loadLinguist() {
  const { data } = await axios.get(config.url);
  return yaml.safeLoad(data);
}

function transformLanguage(name, data) {
  return {
    name,
    aliases: data.aliases,
    aceMode: data.ace_mode,
  };
}

function transformLinguist(linguist) {
  const output = {};

  for (const [language, data] of Object.entries(linguist)) {
    output[data.language_id] = transformLanguage(language, data);
  }

  return output;
}

function writeFile(content) {
  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
  }

  fs.writeFileSync('./dist/index.json', JSON.stringify(content, null, 2));
}

async function main() {
  const linguist = await loadLinguist();
  const output = transformLinguist(linguist);
  writeFile(output);
}

main();
