export const state = () => ({
  key: null,
  content: '',
  language: null,

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
  loadSuccess(state, bin) {
    state.key = bin.key;
    state.content = bin.content;
    state.language = bin.language;

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
      language: state.language,
    });

    commit('saveSuccess', res.key);
  },
};
