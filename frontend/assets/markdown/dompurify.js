import DOMPurify from 'dompurify';

import { imageURL } from '@/assets/proxy.js';

if (process.client) {
  // Add rel to <a>
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      node.setAttribute('rel', 'nofollow noopener');
    }
  });
}

async function proxyURLs(dom) {
  const nodes = [...dom.querySelectorAll('[src]')];
  const urls = await Promise.all(nodes.map(node => imageURL(node.src)));

  nodes.forEach((node, i) => {
    node.src = urls[i]; // eslint-disable-line no-param-reassign
  });
}

export async function sanitize(html) {
  const sanitized = DOMPurify.sanitize(html, {
    FORBID_TAGS: ['style'],
    FORBID_ATTR: ['style'],
  });

  const dom = new DOMParser().parseFromString(sanitized, 'text/html').body;

  await proxyURLs(dom);

  return dom.outerHTML;
}
