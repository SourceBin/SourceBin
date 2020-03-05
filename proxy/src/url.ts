import dns from 'dns';
import ipaddr from 'ipaddr.js';
import normalizeUrl from 'normalize-url';

export function isPrivateAddress(hostname: string): Promise<boolean> {
  return new Promise((res) => {
    dns.resolve4(hostname, (err, addresses) => {
      if (err) {
        res(true);
      } else {
        res(
          addresses.some(address => ipaddr.parse(address).range() === 'private'),
        );
      }
    });
  });
}

export function normalize(url: string): string {
  return normalizeUrl(url, {
    defaultProtocol: 'https:',
    stripHash: true,
    stripWWW: false,
    removeQueryParameters: [],
  });
}
