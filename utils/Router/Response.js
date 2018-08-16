const { gzip } = require('../Methods.js');
const { ServerResponse } = require('http');

/**
 * Return HTML
 * @param {Number} statusCode The 3-digit HTTP status code
 * @param {String|Buffer} html The HTML to send
 * @returns {ServerResponse}
 */
ServerResponse.prototype.html = function(statusCode, html) {
  this.writeHead(statusCode, { 'Content-Type': 'text/html' });
  return this.end(html);
};

/**
 * Return CSS
 * @param {Number} statusCode The 3-digit HTTP status code
 * @param {String|Buffer} css The CSS to send
 * @returns {ServerResponse}
 */
ServerResponse.prototype.css = function(statusCode, css) {
  this.writeHead(statusCode, { 'Content-Type': 'text/css' });
  return this.end(css);
};

/**
 * Return JS
 * @param {Number} statusCode The 3-digit HTTP status code
 * @param {String|Buffer} js The JS to send
 * @returns {ServerResponse}
 */
ServerResponse.prototype.js = function(statusCode, js) {
  this.writeHead(statusCode, { 'Content-Type': 'application/javascript' });
  return this.end(js);
};

/**
 * Return JSON
 * @param {Number} statusCode The 3-digit HTTP status code
 * @param {Object|String|Buffer} json The JSON to send
 * @param {Boolean} [stringify=true] Whether to stringify the JSON
 * @returns {ServerResponse}
 */
ServerResponse.prototype.json = function(statusCode, json, stringify = true) {
  this.writeHead(statusCode, { 'Content-Type': 'application/json' });
  return this.end(stringify ? JSON.stringify(json) : json);
};
