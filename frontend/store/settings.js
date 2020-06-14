import { languages } from '@sourcebin/linguist';

export const state = () => ({
  fontSize: 15,
  printMargin: false,
  theme: 'one_dark',
  font: 'Ubuntu Mono',

  languageDetection: true,
  defaultLanguageId: languages.Text,
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

  setLanguageDetection(state, languageDetection) {
    state.languageDetection = languageDetection;
  },
  setDefaultLanguageId(state, id) {
    state.defaultLanguageId = id;
  },
};
