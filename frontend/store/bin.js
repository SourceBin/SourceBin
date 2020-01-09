export const state = () => ({
  key: null,
  language: null,
  content: '',

  saved: false,
});

export const mutations = {
  updateContent(state, content) {
    state.content = content;

    state.saved = false;
  },
  loadSuccess(state, bin) {
    state.key = bin.key;
    state.content = bin.content;

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
    });

    commit('saveSuccess', res.key);
  },
};
