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
   * Compress input to gzip
   * @param {String|Buffer} input Input to compress
   * @param {Object} options Options for the compressing algorithm
   * @returns {Promise<Buffer>}
   */
  static gzip(input, options) {
    if (typeof input !== 'string' && !(input instanceof Buffer)) {
      throw new Error('input must be a string or buffer');
    } else return new Promise((resolve, reject) => {
      zlib.gzip(input, options, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  /**
   * Decompress input to gzip
   * @param {String|Buffer} input Input to decompress
   * @param {Object} options Options for the decompressing algorithm
   * @returns {Promise<Buffer>}
   */
  static gunzip(input, options) {
    if (typeof input !== 'string' && !(input instanceof Buffer)) {
      throw new Error('input must be a string or buffer');
    } else return new Promise((resolve, reject) => {
      zlib.gunzip(input, options, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
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
}
module.exports = Methods;
