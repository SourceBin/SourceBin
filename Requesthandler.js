function promisify(func) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      func(...args, (err, ...params) => {
        if (err) reject(err);
        else resolve(...params);
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
     * @returns {Promise<Array<Object>>}
     */
    this.find = promisify(model.find.bind(model));

    /**
     * Find one database entry matching the query
     * @param {Object} query The query to look for
     * @returns {Promise<Object>}
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
    this.themes = require('./json/themes.json');

    const { Methods, Converter } = require('./utils');
    this.Converter = new Converter({
      languages: `[${this.languages.map(lang => `'${lang.name}'`)}]`,
      themes: `[${this.themes.map(theme => `'${theme.name}'`)}]`
    });

    this.Methods = Methods;
  }

  // NOTE: temporary testing getter
  get html() {
    return this.fs.readFileSync('./html/index.html').toString();
  }

  handleGet(res, data) {
    const { key, extension } = this.Methods.stripPath(data.path);
    if (!key) {
      if (data.javascript || data.css) {
        const path = `./html${data.path.replace('bin', '')}`;
        if (!this.fs.existsSync(path)) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'No file found' }));
        }
        const file = this.fs.readFileSync(path);
        const type = data.javascript ? 'application/javascript' : 'text/css';
        res.writeHead(200, { 'Content-Type': type });
        return res.end(file);
      }
      return this.homepage(res, data);
    }

    this.db.findOne({ key }).then(data => {
      if (!data) return this.homepage(res, data);
      const language = this.Methods.findLanguage(extension, 'extension');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      return res.end(this.Converter.convert(this.html, {
        code: data.code,
        readOnly: true,
        key: key ? `'${key}'` : null,
        language: JSON.stringify(language),
        allowSave: 'false',
        color: key ? key.substring(0, 6) : null
      }));
    });
  }

  handlePost(res, data) {
    const code = data.buffer;
    if (code.length > 100000) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Code may not be more than 100.000 characters long!' }));
    }
    const key = this.Methods.generateKey();
    if (typeof code !== 'string' || !code.length) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid code type, must be a string!' }));
    }
    const model = this.db.createModel({ key, code });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ key }));
  }

  handleLanguage(res, data) {
    const { query: { search } } = data;
    if (!search) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Provide a search' }));
    }
    const language = this.Methods.findLanguage(search, 'name');
    if (!language) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Didn\'t find a language' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(language));
  }

  handleTheme(res, data) {
    const { query: { search } } = data;
    if (!search) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Provide a search' }));
    }
    const theme = this.Methods.findTheme(search, 'name');
    if (!theme) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Didn\'t find a theme' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(theme));
  }

  handleList(res, data) {
    this.db.find().then(data => {
      const keys = data.map(item => item.key);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(keys));
    });
  }

  homepage(res, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(this.Converter.convert(this.html));
  }
}
module.exports = Requesthandler;
