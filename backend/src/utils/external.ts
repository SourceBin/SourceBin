import axios from 'axios';
import normalizeUrl from 'normalize-url';
import { get, set } from '../redis';

import { external } from '../config';

export async function loadExternal(url: string): Promise<any> {
  const normalized = normalizeUrl(url, {
    defaultProtocol: 'https:',
    stripHash: true,
    stripWWW: false,
    removeQueryParameters: [],
  });

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
