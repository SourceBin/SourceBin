import clipboardCopy from 'clipboard-copy';

import { selectLanguage } from '@/assets/language.js';

export async function save(nuxt) {
  if (nuxt.$store.state.bin.saved) {
    nuxt.$toast.global.error('This bin is already saved');
    return;
  }

  if (!nuxt.$store.state.bin.content) {
    nuxt.$toast.global.error("You can't save an empty bin");
    return;
  }

  const languageId = await selectLanguage(nuxt.$store);
  if (languageId === undefined) {
    return;
  }

  try {
    // Save bin
    await nuxt.$store.dispatch('bin/save');
  } catch {
    nuxt.$toast.global.error('An error occured while saving');
    return;
  }

  // Update URL with key
  window.history.pushState(null, null, nuxt.$store.state.bin.key);

  try {
    // Copy URL to clipboard
    await clipboardCopy(window.location.href);
    nuxt.$toast.global.success('Successfully saved and copied to clipboard');
  } catch {
    // If copying to clipboard fails, still display that the bin got saved
    nuxt.$toast.global.success('Successfully saved');
  }
}
