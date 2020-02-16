import dns from 'dns';
import axios from 'axios';
import { parse } from 'url';
import ipaddr from 'ipaddr.js';
import normalizeUrl from 'normalize-url';

import { get, set } from '../redis';
import { external } from '../config';

function isPrivateAddress(hostname: string): Promise<boolean> {
  return new Promise((res, rej) => {
    dns.resolve4(hostname, (err, addresses) => {
      if (err) {
        rej(err);
      } else {
        res(
          addresses.some(address => ipaddr.parse(address).range() === 'private'),
        );
      }
    });
  });
}

export async function loadExternal(url: string): Promise<{ error: boolean; content: string }> {
  const normalized = normalizeUrl(url, {
    defaultProtocol: 'https:',
    stripHash: true,
    stripWWW: false,
    removeQueryParameters: [],
  });

  const { hostname } = parse(normalized);
  if (!hostname) {
    return { error: true, content: 'Invalid URL' };
  }

  const isPrivate = await isPrivateAddress(hostname);
  if (isPrivate) {
    return { error: true, content: 'URL not accessible' };
  }

  const key = `external:${normalized}`;
  const cache = await get(key);
  if (cache) {
    return { error: false, content: cache };
  }

  const { data } = await axios.get<string>(normalized, {
    timeout: external.timeout,
    validateStatus: () => true, // allow all status codes
    transformResponse: res => res, // prevent JSON.parse on json
  });

  await set(key, data, 'PX', external.expire);
  return { error: false, content: data };
}
