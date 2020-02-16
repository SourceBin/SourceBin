import { linguist, languages } from '@packages/linguist';

export function getLanguageById(id) {
  return linguist[id];
}

export function getLanguageByName(name) {
  const id = languages[name];
  return getLanguageById(id);
}

export function getActiveLanguage(store, route) {
  if (route.query.lang) {
    return getLanguageByName(route.query.lang);
  }

  if (store.state.bin.languageId !== undefined) {
    return getLanguageById(store.state.bin.languageId);
  }

  return getLanguageById(store.state.settings.defaultLanguageId);
}
