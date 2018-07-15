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

      // Make custom logger class
      console.log('='.repeat(50) + '\n');
      if (path.match(/^(editor)\/(.+?)\.(js)/)) console.log('LOADING EDITOR FILES!');
      console.log(parsedUrl);
      console.log(rawPath);
      console.log(path);
      console.log(query);
      console.log(method);
      console.log(headers);

      const decoder = new StringDecoder('utf-8');
      let buffer = '';
      req.on('data', data => buffer += decoder.write(data));
      req.on('end', async () => {
        buffer += decoder.end();
        console.log(buffer);
        console.log('='.repeat(50) + '\n');

        const data = { path, query, method, headers, buffer };

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
