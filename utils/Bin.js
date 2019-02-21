const crypto = require('crypto');

class Bin {
  /**
   * Generates a random 10 char hex key
   * @returns {String}
   */
  static generateKey() {
    return crypto.randomBytes(5).toString('hex');
  }

  /**
   * Check if code is valid for a bin
   * @param {String} the code to check
   * @returns {Object}
   */
  static isValid(code) {
    let error;

    if (typeof code !== 'string') error = 'Expected a string';
    else if (!code.length) error = 'Can\'t save an empty string';
    else if (code.length > 100000) error = 'String is too long, max 100.000';

    return { valid: !error, error };
  }
}
module.exports = Bin;
