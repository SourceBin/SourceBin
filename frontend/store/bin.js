export const state = () => ({
  key: null,
  content: '',
  languageId: null,

  saved: false,
});

export const mutations = {
  reset(s) {
    Object.assign(s, state());
  },
  updateContent(state, content) {
    state.content = content;

    state.key = null;
    state.saved = false;
  },
  setLanguageId(state, languageId) {
    state.languageId = languageId;
  },
  loadSuccess(state, bin) {
    state.key = bin.key;
    state.content = bin.content;
    state.languageId = bin.languageId;

    state.saved = true;
  },
  saveSuccess(state, key) {
    state.key = key;

    state.saved = true;
  },
};

export const actions = {
  async load({ commit }, key) {
    const bin = await this.$axios.$get(`/bins/${key}`);

    commit('loadSuccess', bin);
  },
  async save({ commit, state }) {
    const res = await this.$axios.$post('/bins', {
      content: state.content,
      languageId: state.languageId,
    });

    commit('saveSuccess', res.key);
  },
};
