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
    this.languages = require('./json/languages.json');

    const { Converter } = require('./utils');
    this.Converter = new Converter({
      languages: `[${this.languages.map(lang => `'${lang.name}'`)}]`
    });

    this.crypto = require('crypto');
  }

  // NOTE: temporary testing getter
  get html() {
    return this.fs.readFileSync('./html/index.html').toString();
  }

  handleLanguage(req, res, data) {
    const { query: { search } } = data;
    if (!search) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Provide a search' }));
    }
    const language = this.findLanguage(search.toLowerCase());
    if (!language) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Didn\'t find a language' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(language));
  }

  handleList(req, res, data) {
    this.db.find().then(data => {
      const keys = data.map(item => item.key);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(keys));
    });
  }

  handleGet(req, res, data) {
    const { key, extension } = this.stripPath(data.path);
    if (!key) {
      if (data.editor) {
        const file = this.fs.readFileSync(`./html/${data.path}`);
        if (!file) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'No file found' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        return res.end(file);
      }
      return this.returnHomepage(req, res, data);
    }

    this.db.findOne({ key }).then(data => {
      if (!data) return this.returnHomepage(req, res, data);
      const language = this.findLanguage(extension);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(this.Converter.convert(this.html, {
        code: data.code,
        readOnly: true,
        key: key ? `'${key}'` : null,
        language: JSON.stringify(language),
        saving: 'disabled',
        color: key ? key.substring(0, 6) : null
      }));
    });
  }

  handlePost(req, res, data) {
    const code = data.buffer;
    if (code.length > 100000) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Code may not be more than 100.000 characters long!' }));
    }
    const key = this.generateKey();
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

  stripPath(path) {
    const match = /([a-f0-9]{8})\.?([a-zA-Z0-9]+)?/.exec(path.split('/')[0]) || [];
    return { key: match[1], extension: match[2] };
  }

  findLanguage(search) {
    return this.languages.find(lang => {
      const { ace, name, extension } = lang;
      return [ace, name.toLowerCase(), extension].includes(search);
    });
  }

}
module.exports = Requesthandler;
