import { languages } from '@sourcebin/linguist';

export const state = () => ({
  fontSize: 15,
  printMargin: true,
  theme: 'one_dark',
  font: 'Ubuntu Mono',

  defaultLanguageId: languages.Text,
  promptLanguageSelectOnSave: true,
});

export const mutations = {
  setFontSize(state, fontSize) {
    state.fontSize = fontSize;
  },
  setPrintMargin(state, printMargin) {
    state.printMargin = printMargin;
  },
  setTheme(state, theme) {
    state.theme = theme;
  },
  setFont(state, font) {
    state.font = font;
  },

  setDefaultLanguageId(state, id) {
    state.defaultLanguageId = id;
  },
  promptLanguageSelectOnSave(state, promptLanguageSelectOnSave) {
    state.promptLanguageSelectOnSave = promptLanguageSelectOnSave;
  },
};
