import clipboardCopy from 'clipboard-copy';

import { promptLanguageSelect } from '@/assets/language.js';

function setLanguageIdFromDefault(store) {
  if (store.state.bin.languageId === undefined) {
    store.commit('bin/setLanguageId', store.state.settings.defaultLanguageId);
  }
}

export async function save(nuxt) {
  const { bin, settings } = nuxt.$store.state;

  if (bin.saved) {
    nuxt.$toast.global.error('This bin is already saved');
    return;
  }

  if (!bin.content) {
    nuxt.$toast.global.error("You can't save an empty bin");
    return;
  }

  if (settings.promptLanguageSelectOnSave) {
    const language = await promptLanguageSelect(nuxt.$store);

    if (language === undefined) {
      return;
    }
  } else {
    setLanguageIdFromDefault(nuxt.$store);
  }

  try {
    // Save bin
    await nuxt.$store.dispatch('bin/save');
  } catch {
    nuxt.$toast.global.error('An error occured while saving');
    return;
  }

  // Update URL with key
  window.history.pushState(null, null, bin.key);

  try {
    // Copy URL to clipboard
    await clipboardCopy(window.location.href);
    nuxt.$toast.global.success('Successfully saved and copied to clipboard');
  } catch {
    // If copying to clipboard fails, still display that the bin got saved
    nuxt.$toast.global.success('Successfully saved');
  }
}
