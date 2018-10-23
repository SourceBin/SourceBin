const crypto = require('crypto');
const zlib = require('zlib');
const request = require('request');
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

  /**
   * Make a http request
   * @param {String} method The http method to use
   * @param {String} options The options to pass to the `request` library
   * @param {Boolean} [json=true] Whether the response will be JSON
   * @returns {Promise<Object|String>}
   */
  static request(method, options, json = true) {
    return new Promise((resolve, reject) => {
      request[method.toLowerCase()](options, (err, _, body) => {
        if (err) reject(err);
        else resolve(json ? JSON.parse(body) : body);
      });
    });
  }

  /**
   * Create a cookie
   * @param  {String} name Name of the cookie
   * @param  {String} value Value of the cookie
   * @param {Object} [options] The options for the cookie
   * @param  {Date|String} [options.expires] When the cookie should expire, default to 10 years in the future
   * @param  {String} [options.path='/'] The path to set the cookie on
   * @param  {Boolean} [options.httpOnly=false] Whether the cookie should be http only
   * @param {String} [options.sameSite] The same site option, must be `strict` or `lax`
   * @returns {String}
   */
  static createCookie(name, value, options) {
    let expires = options.expires;
    const path = options.path || '/';
    const httpOnly = options.httpOnly || false;
    const sameSite = options.sameSite;

    if (!expires) expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365 * 10);
    if (expires instanceof Date) expires = expires.toUTCString();

    value += expires ? `; expires=${expires}` : '';
    value += path ? `; path=${path}` : '';
    value += httpOnly ? '; HttpOnly' : '';
    value += sameSite ? `; SameSite=${sameSite}` : '';

    return `${name}=${value}`;
  }
}
module.exports = Methods;
