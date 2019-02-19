module.exports = register => {
  register('models', require('utils/models')(require('mongoose')));
};

module.exports.priority = 1;
