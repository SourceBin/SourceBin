import marked from 'marked';

import { renderer } from './renderer.js';

onmessage = (e) => {
  const rendered = marked(e.data, {
    renderer,
    gfm: true,
  });

  postMessage(rendered);
};
