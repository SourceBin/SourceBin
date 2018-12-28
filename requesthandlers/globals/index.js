const fs = require('fs');

module.exports = {};
fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.js') && file !== 'index.js')
  .forEach(file => {
    module.exports[file.slice(0, -3)] = require(`./${file}`);
  });
