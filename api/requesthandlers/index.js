const fs = require('fs');

module.exports = router => {
  const models = require('utils/models')(require('mongoose'));
  const ratelimiters = require('./globals/ratelimiters.js')(models);

  fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.js') && file !== 'index.js')
    .forEach(file => {
      const fn = require(`./${file}`);
      if (typeof fn === 'function') {
        fn(router, ratelimiters, models);
      }
    });
};
