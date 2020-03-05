import http from 'http';
import HttpProxy from 'http-proxy';

import {
  timeout, proxyTimeout,
  defaultCacheControl,
  maxContentLength, maxContentLengthUnknown,
} from './config';

export function error(res: http.ServerResponse, code = 404, message = '404 not found'): void {
  res.writeHead(code, { 'Content-Type': 'text/plain' });
  res.end(message);
}

function setResponseHeaders(proxyRes: http.IncomingMessage, res: http.ServerResponse): void {
  const cacheControl = proxyRes.headers['cache-control'] || defaultCacheControl;
  res.setHeader('Cache-Control', cacheControl);
}

function handleContentLength(proxyRes: http.IncomingMessage, res: http.ServerResponse): void {
  const contentLength = proxyRes.headers['content-length'];

  // If content length is provided check if it reached the limit
  if (contentLength) {
    if (Number(contentLength) > maxContentLength) {
      error(res, 400, 'Size limit reached');
    }

    return;
  }

  // If content length is not provided, check it while data is coming in
  let bodyLength = 0;
  proxyRes.on('data', (chunk: Buffer) => {
    bodyLength += chunk.byteLength;

    if (bodyLength > maxContentLengthUnknown) {
      proxyRes.destroy(new Error('Size limit reached'));
    }
  });
}

export function createProxy(): HttpProxy {
  const proxy = HttpProxy.createProxyServer({
    timeout,
    proxyTimeout,
    ignorePath: true,
    changeOrigin: true,
    followRedirects: true,
  });

  proxy.on('error', (_err, _req, res) => {
    // If the headers have been sent the response is just ended. The statuscode
    // and content type can't be changed anymore, because the response is
    // streamed. Otherwise, return an error status
    if (res.headersSent) {
      res.end();
    } else {
      error(res);
    }
  });

  proxy.on('proxyRes', (proxyRes, _req, res) => {
    setResponseHeaders(proxyRes, res);
    handleContentLength(proxyRes, res);
  });

  return proxy;
}
