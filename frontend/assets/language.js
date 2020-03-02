import { linguist, languages } from '@sourcebin/linguist';

import { eventBus } from '@/assets/eventBus.js';
import { languageOptions } from '@/assets/selector/options.js';

export function getLanguageById(id) {
  return linguist[id];
}

export function getLanguageByName(name) {
  const id = languages[name];
  return getLanguageById(id);
}

export function getActiveLanguage(store, route) {
  if (route.query.lang) {
    const language = getLanguageByName(route.query.lang);

    if (language) {
      return language;
    }
  }

  if (store.state.bin.languageId !== undefined) {
    return getLanguageById(store.state.bin.languageId);
  }

  return getLanguageById(store.state.settings.defaultLanguageId);
}

export function promptLanguageSelect(store, defaultLanguage = false) {
  return new Promise((res) => {
    eventBus.$emit('promptSelect', 'Language Selector', languageOptions, (languageId) => {
      if (languageId !== undefined) {
        if (defaultLanguage) {
          store.commit('settings/setDefaultLanguageId', languageId);
        } else {
          store.commit('bin/setLanguageId', languageId);
        }
      }

      res(languageId);
    });
  });
}
