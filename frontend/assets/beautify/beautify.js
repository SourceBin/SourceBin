import { languages } from '@sourcebin/linguist';

import BeautifyWorker from './beautify.worker.js';

const parsers = {
  [languages.JavaScript]: 'babel',
  [languages.TypeScript]: 'typescript',
  [languages.CSS]: 'css',
  [languages.SCSS]: 'scss',
  [languages.Less]: 'less',
  [languages.JSON]: 'json',
  [languages.JSON5]: 'json5',
  [languages.GraphQL]: 'graphql',
  [languages.Markdown]: 'markdown',
  [languages.HTML]: 'html',
  [languages.Vue]: 'vue',
  [languages.YAML]: 'yaml',
  [languages.Handlebars]: 'glimmer',
};

export function getParser(language) {
  return parsers[languages[language]];
}

export function beautify(source, language) {
  return new Promise((res, rej) => {
    const worker = new BeautifyWorker();

    const timeout = setTimeout(() => {
      worker.terminate();
      rej(new Error('Formatting took too long!'));
    }, 30 * 1000);

    worker.onmessage = (e) => {
      clearTimeout(timeout);
      worker.terminate();

      if (e.data.error) {
        rej(new Error(e.data.error));
      } else {
        res(e.data.result);
      }
    };

    worker.postMessage({
      source,
      language: getParser(language),
    });
  });
}
