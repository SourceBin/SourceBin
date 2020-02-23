import clipboardCopy from 'clipboard-copy';

import { selectLanguage } from '@/assets/language.js';

export async function save(nuxt) {
  if (!nuxt.$store.state.bin.content) {
    nuxt.$toast.global.error("You can't save an empty bin");
    return;
  }

  try {
    const languageId = await selectLanguage(nuxt.$store);

    if (languageId !== undefined) {
      await nuxt.$store.dispatch('bin/save');

      // Update URL with key
      window.history.pushState(null, null, nuxt.$store.state.bin.key);

      // Copy URL to clipboard
      await clipboardCopy(window.location.href);
      nuxt.$toast.global.success('Copied link to clipboard');
    }
  } catch {
    nuxt.$toast.global.error('An error occured while saving');
  }
}
