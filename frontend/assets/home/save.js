import clipboardCopy from 'clipboard-copy';

import { selectLanguage } from './selectLanguage.js';

export async function save(store) {
  const languageId = await selectLanguage(store);

  if (languageId !== undefined) {
    await store.dispatch('bin/save');

    // Update URL with key
    window.history.pushState(null, null, store.state.bin.key);

    // Copy URL to clipboard
    await clipboardCopy(window.location.href);
  }
}
