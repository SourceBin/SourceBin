const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const crypto = require('crypto');

const mongoose = require('mongoose');
const config = require('./config.json');
const { database: { username, password, host, database } } = config;
const uri = `mongodb+srv://${username}:${password}@${host}.mongodb.net/${database}?retryWrites=true`;

mongoose.connect(uri, { useNewUrlParser: true })
  .then(() => {
    const Requesthandler = new(require('./Requesthandler.js'))();

    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);

      const rawPath = parsedUrl.pathname;
      const path = rawPath.replace(/^\/+|\/+$/g, '');

      const query = parsedUrl.query;
      const method = req.method.toLowerCase();
      const headers = req.headers;

      const editor = path.match(/^(editor)\/(.+?)\.(js)$/);
      const log = editor || path.match('favicon.ico') ? function() {} : console.log;

      const decoder = new StringDecoder('utf-8');
      let buffer = '';
      req.on('data', data => buffer += decoder.write(data));
      req.on('end', async () => {
        buffer += decoder.end();
        const data = { path, query, method, headers, buffer, editor };

        log('='.repeat(50) + '\n');
        log(data);
        log('='.repeat(50) + '\n');

        if (path.toLowerCase() === 'language') return Requesthandler.handleLanguage(req, res, data);
        if (path.toLowerCase() === 'list') return Requesthandler.handleList(req, res, data);
        if (method === 'get') return Requesthandler.handleGet(req, res, data);
        if (method === 'post') return Requesthandler.handlePost(req, res, data);
      });
    });
    server.listen(3000, () => console.log('HTTP server is running! \n\n'));
  })
  .catch(e => console.log(e));

function end(res, code, content) {
  res.writeHead(code);
  if (typeof content === 'string') content = { error: content };
  return res.end(JSON.stringify(content));
}
