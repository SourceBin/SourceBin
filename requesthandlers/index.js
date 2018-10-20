const fs = require('fs');

module.exports = router => {
  const { ratelimiters, databases } = require('./globals');

  const files = fs.readdirSync(__dirname)
    .filter(file => file.endsWith('.js') && file !== 'index.js')
    .forEach(file => {
      const fn = require(`./${file}`);
      if (typeof fn === 'function') {
        fn(router, ratelimiters, databases);
      }
    });
}
