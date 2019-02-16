const fs = require('fs');

function createModels(mongoose) {
  const models = {};

  fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.js') && file !== 'index.js')
    .forEach(file => {
      models[file.slice(0, -3)] = require(`./${file}`)(mongoose);
    });

  return models;
}

module.exports = createModels;
