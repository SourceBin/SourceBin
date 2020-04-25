import clipboardCopy from 'clipboard-copy';

function setLanguageIdFromDefault(store) {
  store.state.bin.files.forEach((file, index) => {
    if (file.languageId === undefined) {
      store.commit('bin/setLanguageId', {
        languageId: store.state.settings.defaultLanguageId,
        file: index,
      });
    }
  });
}

function isEmptyBin(bin) {
  return bin.files.some(file => file.content === '');
}

export async function save(nuxt) {
  const { bin, settings } = nuxt.$store.state;

  if (bin.saved) {
    nuxt.$toast.global.error('This bin is already saved');
    return;
  }

  if (isEmptyBin(bin)) {
    nuxt.$toast.global.error("You can't save an empty bin");
    return;
  }

  if (!settings.languageDetection) {
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
    // Create share URL and copy to clipboard
    const shareURL = new URL(bin.key, `https://${process.env.SHARE_DOMAIN}`);
    await clipboardCopy(shareURL);

    nuxt.$toast.global.success('Successfully saved and copied to clipboard');
  } catch {
    // If copying to clipboard fails, still display that the bin got saved
    nuxt.$toast.global.success('Successfully saved');
  }
}
