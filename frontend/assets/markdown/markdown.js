import DOMPurify from 'dompurify';

import MarkedWorker from './marked.worker.js';

function sanitize(html) {
  return DOMPurify.sanitize(html);
}

export function render(markdown) {
  return new Promise((res, rej) => {
    const worker = new MarkedWorker();

    const timeout = setTimeout(() => {
      worker.terminate();
      rej(new Error('Rendering took too long!'));
    }, 30 * 1000);

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      worker.terminate();

      res(sanitize(e.data));
    };

    worker.postMessage(markdown);
  });
}

export function isMarkdown(language) {
  return language.name === 'Markdown';
}
