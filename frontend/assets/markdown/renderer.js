import hljs from 'highlight.js';
import { Renderer } from 'marked';

export const renderer = new Renderer();

renderer.code = (code, language) => {
  const highlighted = hljs.highlight(
    hljs.getLanguage(language) ? language : 'plaintext',
    code,
  ).value;

  return `<pre><code class="hljs">${highlighted}</code></pre>`;
};
