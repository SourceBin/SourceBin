const fs = require('fs');

function nameToTheme(name) {
  return name.toLowerCase().replace(/ /g, '_');
}

const themes = fs
  .readFileSync('names.txt')
  .toString()
  .split('\n')
  .reduce((obj, name) => ({
    ...obj,
    [nameToTheme(name)]: name,
  }), {});

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
}

fs.writeFileSync('./dist/index.json', JSON.stringify(themes, null, 2));
