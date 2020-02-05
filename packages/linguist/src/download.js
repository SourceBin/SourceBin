const axios = require('axios');
const yaml = require('js-yaml');

module.exports = async (url) => {
  const { data } = await axios.get(url);
  return yaml.safeLoad(data);
};
