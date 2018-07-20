const crypto = require('crypto');
const languages = require('../json/languages.json');

class Methods {
  static generateKey() {
    return crypto.randomBytes(4).toString('hex');
  }

  static stripPath(path) {
    const match = /([a-f0-9]{8})\.?([a-zA-Z0-9]+)?/.exec(path.split('/')[0]) || [];
    return { key: match[1], extension: match[2] };
  }

  static findLanguage(search) {
    return languages.find(lang => {
      const { ace, name, extension } = lang;
      return [ace, name.toLowerCase(), extension].includes(search);
    });
  }
}
module.exports = Methods;
