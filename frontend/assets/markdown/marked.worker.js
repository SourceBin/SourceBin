import hljs from 'highlight.js';
import marked, { Renderer } from 'marked';

const renderer = new Renderer();
renderer.code = (code, language) => {
  const highlighted = hljs.highlight(
    hljs.getLanguage(language) ? language : 'plaintext',
    code,
  ).value;

  return `<pre><code class="hljs">${highlighted}</code></pre>`;
};

onmessage = (e) => {
  const rendered = marked(e.data, {
    renderer,
    gfm: true,
  });

  postMessage(rendered);
};
