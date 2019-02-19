module.exports = register => {
  register('redis', require('redis').createClient(process.env.REDIS_URL));
};

module.exports.priority = 1;
