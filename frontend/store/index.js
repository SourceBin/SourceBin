import themes from 'themes';
import { linguist } from 'linguist';

export const getters = {
  theme(state) {
    return themes[state.settings.theme];
  },
  language(state) {
    return linguist[state.bin.languageId || state.settings.defaultLanguageId];
  },
};
