import BeautifyWorker from './beautify.worker.js';

const supportedLanguages = [
  'javascript',
  'typescript',
  'css',
  'scss',
  'less',
  'json',
  'json5',
  'graphql',
  'markdown',
  'html',
  'vue',
  'yaml',
  'php',
];

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
        rej(new Error('Unable to format this file!'));
      } else {
        res(e.data.result);
      }
    };

    worker.postMessage({
      source,
      language: language.name.toLowerCase(),
    });
  });
}

export function canBeautify(language) {
  return supportedLanguages.includes(language.name.toLowerCase());
}
