import url from 'url';
import http from 'http';

import { createProxy, error } from './proxy';
import { normalize, isPrivateAddress } from './url';

const proxy = createProxy();

const server = http.createServer(async (req, res) => {
  const { query } = url.parse(req.url || '', true);

  if (typeof query.q !== 'string') {
    error(res);
    return;
  }

  const target = normalize(query.q);

  const { hostname } = url.parse(target);
  if (!hostname || await isPrivateAddress(hostname)) {
    error(res);
    return;
  }

  proxy.web(req, res, { target });
});

server.listen(
  process.env.PORT,
  () => console.log(`Listening on port ${process.env.PORT}`),
);
