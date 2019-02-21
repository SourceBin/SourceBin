const { request, createCookie } = require('./Methods.js');
const url = require('url');

const API_ENDPOINT = 'https://discordapp.com/api/v6';

class Discord {
  /**
   * Create an instance of the Discord class
   * @param {String} uri The uri
   * @param {String} secret The secret
   */
  constructor(uri, secret) {
    const oauth2 = url.parse(uri, true);
    this.client_id = oauth2.query.client_id;
    this.redirect_uri = oauth2.query.redirect_uri;
    this.scope = oauth2.query.scope;

    this.client_secret = secret;
  }

  /**
   * Exchange oauth code for access token
   * @param {String} code The oauth code
   * @returns {Object}
   */
  exchangeCode(code) {
    return request('post', {
      url: `${API_ENDPOINT}/oauth2/token`,
      form: {
        grant_type: 'authorization_code',
        client_id: this.client_id,
        client_secret: this.client_secret,
        redirect_uri: this.redirect_uri,
        scope: this.scope,
        code,
      },
    });
  }

  /**
   * Refresh access token using the refresh token
   * @param {String} refresh_token The refresh token for the access token
   * @returns {Object}
   */
  refreshToken(refresh_token) {
    return request('post', {
      url: `${API_ENDPOINT}/oauth2/token`,
      form: {
        grant_type: 'refresh_token',
        client_id: this.client_id,
        client_secret: this.client_secret,
        redirect_uri: this.redirect_uri,
        scope: this.scope,
        refresh_token,
      },
    });
  }

  /**
   * Set the tokens received from discord oauth in the user's cookies
   * @param {ServerResponse} res The ServerResponse object
   * @param {Object} tokens The tokens received from discord
   */
  setTokens(reply, tokens) {
    const cookies = [
      createCookie('access_token', tokens.access_token, {
        expires: new Date(Date.now() + (tokens.expires_in * 1000)),
        httpOnly: true,
        sameSite: 'strict',
      }),
      createCookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        sameSite: 'strict',
      }),
    ];

    reply.header('Set-Cookie', [...reply.getHeader('Set-Cookie') || [], ...cookies]);
  }

  /**
   * Fetch information about a user
   * @param {String} token The access token of the user
   * @returns {Object}
   */
  getUser(token) {
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
        bearer: token,
      },
    });
  }

  /**
   * Get the avatar of a user
   * @param {Object} user The user to get the avatar of
   * @param {Number} [size=256] The size of the avatar, can be any power of two between 16 and 2048
   * @returns {String}
   */
  static getAvatar(user, size = 256) {
    let url = 'https://cdn.discordapp.com/';

    if (user.avatar) {
      url += `avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}`;
    } else {
      url += `embed/avatars/${user.discriminator % 5}.png`;
    }

    return `${url}?size=${size}`;
  }
}
module.exports = Discord;
