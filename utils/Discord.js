const { request, createCookie } = require('./Methods.js');
const config = require('../config.json');
const url = require('url');
const fs = require('fs');

const oauth2 = url.parse(config.oauth2.uri, true);
const client_id = oauth2.query.client_id;
const redirect_uri = oauth2.query.redirect_uri;
const scope = oauth2.query.scope;

const client_secret = config.oauth2.client_secret;
const redirectPath = url.parse(redirect_uri).pathname;
const API_ENDPOINT = 'https://discordapp.com/api/v6';

class Discord {

  /**
   * Exchange oauth code for access token
   * @param {String} code The oauth code
   * @returns {Object}
   */
  static exchangeCode(code) {
    return request('post', {
      url: `${API_ENDPOINT}/oauth2/token`,
      form: {
        grant_type: 'authorization_code',
        client_id,
        client_secret,
        redirect_uri,
        scope,
        code
      }
    });
  }

  /**
   * Refresh access token using the refresh token
   * @param {String} refresh_token The refresh token for the access token
   * @returns {Object}
   */
  static refreshToken(refresh_token) {
    return request('post', {
      url: `${API_ENDPOINT}/oauth2/token`,
      form: {
        grant_type: 'refresh_token',
        client_id,
        client_secret,
        redirect_uri,
        scope,
        refresh_token
      }
    });
  }

  /**
   * Set the tokens received from discord oauth in the user's cookies
   * @param {ServerResponse} res The ServerResponse object
   * @param {Object} tokens The tokens received from discord
   */
  static setTokens(res, tokens) {
    const cookies = [
      createCookie('access_token', tokens.access_token, {
        expires: new Date(new Date().getTime() + tokens.expires_in * 1000),
        httpOnly: true,
        sameSite: 'strict'
      }),
      createCookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        sameSite: 'strict'
      })
    ];
    res.setHeader('Set-Cookie', cookies);
  }

  /**
   * Fetch information about a user
   * @param {String} token The access token of the user
   * @returns {Object}
   */
  static getUser(token) {
    return Discord.fetch('/users/@me', 'get', token);
  }

  /**
   * Wrapper for the fetch wrapper to make discord api requests easier
   * @param {String} url The path url
   * @param {String} method The HTTP method to use
   * @param {String} token The access token of the user
   * @returns {Promise<Object|String>}
   */
  static fetch(url, method, token) {
    return request(method, {
      url: API_ENDPOINT + url,
      auth: {
        bearer: token
      }
    });
  }
}
module.exports = Discord;
