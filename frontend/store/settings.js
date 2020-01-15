export const state = () => ({
  theme: 'dracula',
});

export const mutations = {
  setTheme(state, theme) {
    state.theme = theme;
  },
};
