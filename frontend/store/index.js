import themes from '@packages/themes';
import { linguist } from '@packages/linguist';

export const getters = {
  theme(state) {
    return themes[state.settings.theme];
  },
  language(state) {
    return linguist[state.bin.languageId || state.settings.defaultLanguageId];
  },
};
