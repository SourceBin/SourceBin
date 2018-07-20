/**
 * Distributed under the ISC license:
 *
 * Copyright 2018 SebastiaanYN
 * Permission to use, copy, modify, and/or distribute this software for any purpose
 * with or without fee is hereby granted, provided that the above copyright notice
 * and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 * TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
 * THIS SOFTWARE.
 *
 */

const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const mongoose = require('mongoose');
const config = require('./config.json');
const { database: { username, password, host, database } } = config;
const uri = `mongodb+srv://${username}:${password}@${host}.mongodb.net/${database}?retryWrites=true`;

mongoose.connect(uri, { useNewUrlParser: true })
  .then(() => {
    const Requesthandler = new(require('./Requesthandler.js'))();
    const RateLimiter = new(require('./utils').RateLimiter)(500);

    const server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url, true);

      const rawPath = parsedUrl.pathname;
      const path = rawPath.replace(/^\/+|\/+$/g, '');

      const query = parsedUrl.query;
      const method = req.method.toLowerCase();
      const headers = req.headers;

      const ip = (req.headers['x-forwarded-for'] || '').split(',').shift() ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      const javascript = path.match(/^(bin)\/(.+?)\/(.+?)\.(js)$/);
      const favicon = path.match('favicon.ico');

      const decoder = new StringDecoder('utf-8');
      let buffer = '';
      req.on('data', data => buffer += decoder.write(data));
      req.on('end', () => {
        buffer += decoder.end();
        const data = { ip, path, query, method, headers, buffer, javascript };

        if (!javascript && !favicon)
          console.log(`${ip} > ${method} ${path || '/'} ${Object.keys(query).length ? JSON.stringify(query) : ''}`);

        if (path.toLowerCase().startsWith('language')) return Requesthandler.handleLanguage(res, data);
        else if (path.toLowerCase().startsWith('list')) return Requesthandler.handleList(res, data);
        else {
          if (method === 'post' && RateLimiter.active(ip)) {
            res.writeHead(429, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Too many requests, try again later' }));
          } else if (method === 'post') RateLimiter.add(ip);

          if (method === 'get') Requesthandler.handleGet(res, data);
          else if (method === 'post') Requesthandler.handlePost(res, data);
          else return Requesthandler.homepage(res, data);
        }
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
