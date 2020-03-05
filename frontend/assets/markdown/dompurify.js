import DOMPurify from 'dompurify';

const PROXY = '/proxy/?q=';

if (process.client) {
  // Proxy URLs
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    const attributes = ['src'];

    for (const attribute of attributes) {
      if (node.hasAttribute(attribute)) {
        const proxy = PROXY + encodeURIComponent(node.getAttribute(attribute));

        node.setAttribute(attribute, proxy);
      }
    }
  });
}

export function sanitize(html) {
  return DOMPurify.sanitize(html);
}
