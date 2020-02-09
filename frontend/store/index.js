import themes from '@packages/themes';
import { linguist } from '@packages/linguist';

export const getters = {
  theme(state) {
    return themes[state.settings.theme];
  },
  language(state) {
    if (state.bin.languageId !== undefined) {
      return linguist[state.bin.languageId];
    }

    return linguist[state.settings.defaultLanguageId];
  },
};
