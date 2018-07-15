function promisify(func) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      func(...args, (err, ...params) => {
        if (err) {
          reject(err);
        } else {
          resolve(...params);
        }
      })
    });
  }
}

class Database {

  constructor(model) {
    if (!model) model = require('./model.js');
    this.model = model;

    /**
     * Find all database entries with this query
     * @param {Object} query The query to look for
     * @returns {Array<Object>}
     * @async
     */
    this.find = promisify(model.find.bind(model));

    /**
     * Find one database entry matching the query
     * @param {Object} query The query to look for
     * @returns {Object}
     * @async
     */
    this.findOne = promisify(model.findOne.bind(model));
  }

  /**
   * Create a new model
   * @param {Object} data The data to pass into the model
   * @returns {Object} The model
   */
  createModel(data) {
    const model = new this.model(data);
    model.save();
    return model;
  }

}


class Requesthandler {

  constructor(model) {
    this.db = new Database(model);

    this.fs = require('fs');
    // this.html = this.fs.readFileSync('./html/index.html').toString();
    this.languages = this.fs.readdirSync('./html/editor')
      .filter(f => f.match(/mode-(.+?)\.js/))
      .map(f => f.replace(/mode-(.+?)\.js/, '$1'))
      .sort();

    const { Converter } = require('./utils');
    this.Converter = new Converter({
      languages: `[${this.languages.map(lang => `'${lang}'`)}]`
    });

    this.crypto = require('crypto');
  }

  // NOTE: temporary testing getter
  get html() {
    return this.fs.readFileSync('./html/index.html').toString();
  }

  handleList(req, res, data) {
    this.db.find().then(data => {
      const keys = data.map(item => item.key);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(keys));
    });
  }

  handleGet(req, res, data) {
    let key = data.path.split('/')[0];
    if (!key.match(/[a-zA-Z0-9]{8}/)) {
      if (data.path.match(/^(editor)\/(.+?)\.(js)/)) {
        const file = this.fs.readFileSync(`./html/${data.path}`);
        if (!file) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'No file found' }));
        }
        res.writeHead(200);
        return res.end(file);
      }
      return this.returnHomepage(req, res, data);
    }

    let match;
    if (match = key.match(/^([a-zA-Z0-9]{8})(\.[a-z0-9_]+?)$/)) key = match[1];

    this.db.findOne({ key }).then(data => {
      if (!data) return this.returnHomepage(req, res, data);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(this.Converter.convert(this.html, { code: data.code, readOnly: true }));
    });
  }

  handlePost(req, res, data) {
    const key = this.generateKey();
    const code = data.buffer;
    if (typeof code !== 'string' || !code.length) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid code type, must be a string!' }));
    }
    const model = this.db.createModel({ key, code });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ key }));
  }

  returnHomepage(req, res, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(this.Converter.convert(this.html));
  }

  generateKey() {
    return this.crypto.randomBytes(4).toString('hex');
  }

}
module.exports = Requesthandler;
