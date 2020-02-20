import { eventBus } from '@/assets/eventBus.js';

export function selectLanguage(store) {
  return new Promise((res) => {
    eventBus.$emit('selectLanguage', (languageId) => {
      if (languageId !== undefined) {
        store.commit('bin/setLanguageId', languageId);
      }

      res(languageId);
    });
  });
}
