const crypto = require('crypto');
const zlib = require('zlib');
const languages = require('../json/languages.json');
const themes = require('../json/themes.json');

class Methods {

  /**
   * Generates a random 8 char key
   * @returns {String}
   */
  static generateKey() {
    return crypto.randomBytes(5).toString('hex');
  }

  /**
   * Find a language by search
   * @param {String} search The search query
   * @param {String} type What type to search for, must be `name` or `extension`
   * @returns {?Object}
   */
  static findLanguage(search, type) {
    if (!search) return null;
    type = type.toLowerCase();
    if (type === 'name') return Object.values(languages).find(language => {
      return language.name.toLowerCase() === search.toLowerCase();
    });
    if (type === 'extension') return Object.values(languages).find(language => {
      if (!language.extensions) return null;
      return language.extensions.includes(search.toLowerCase());
    });
  }

  /**
   * Find a theme by search
   * @param {String} search The search query
   * @param {String} [type] What type to search for, can be `ace` or `name`
   * @returns {Object}
   */
  static findTheme(search, type) {
    return themes.find(theme => {
      if (type) return theme[type.toLowerCase()].toLowerCase() === search.toLowerCase();
      else return [theme.ace, theme.name.toLowerCase()].includes(search.toLowerCase());
    });
  }

  /**
   * Promisify a callback function
   * Must be in format `(err, ...data)`
   * @param {Function} fn The function to promisify
   * @returns {Function}
   */
  static promisify(fn) {
    return (...args) => {
      return new Promise((resolve, reject) => {
        fn(...args, (err, ...params) => {
          if (err) reject(err);
          else resolve(...params);
        });
      });
    }
  }

  /**
   * Escape any html characters that could cause issues
   * @param {String} string The string to escape
   * @returns {String}
   */
  static escapeHtml(string) {
    return string
      .replace(/&/g, '&amp;')
      .replace(/\\/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
module.exports = Methods;
