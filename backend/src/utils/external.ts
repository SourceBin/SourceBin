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

export async function loadExternal(url: string): Promise<any> {
  const normalized = normalizeUrl(url, {
    defaultProtocol: 'https:',
    stripHash: true,
    stripWWW: false,
    removeQueryParameters: [],
  });

  const { hostname } = parse(normalized);
  if (!hostname) {
    throw new Error('Invalid URL');
  }

  const isPrivate = await isPrivateAddress(hostname);
  if (isPrivate) {
    throw new Error('Private IP');
  }

  const key = `external:${normalized}`;
  const cache = await get(key);
  if (cache) {
    return cache;
  }

  const { data } = await axios.get(normalized, {
    timeout: external.timeout,
    validateStatus: () => true, // allow all status codes
    transformResponse: res => res, // prevent JSON.parse on json
  });

  await set(key, data, 'PX', external.expire);
  return data;
}
