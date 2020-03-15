export const state = () => ({
  key: undefined,

  files: [{
    content: '',
    languageId: undefined,
  }],

  saved: false,
});

export const mutations = {
  reset(s) {
    Object.assign(s, state());
  },
  updateContent(state, { content, file }) {
    state.files[file].content = content;

    state.key = undefined;
    state.saved = false;
  },
  setLanguageId(state, { languageId, file }) {
    state.files[file].languageId = languageId;
  },
  loadFromKeySuccess(state, bin) {
    state.key = bin.key;
    state.files = bin.files;

    state.saved = true;
  },
  loadFromQuerySuccess(state, external) {
    state.key = external.src;

    state.files = [{
      content: external.content,
      languageId: undefined,
    }];

    state.saved = true;
  },
  saveSuccess(state, key) {
    state.key = key;

    state.saved = true;
  },
};

export const actions = {
  async loadFromKey({ commit }, key) {
    const bin = await this.$axios.$get(`/api/bins/${key}`);

    commit('loadFromKeySuccess', bin);
  },
  async loadFromQuery({ commit }, query) {
    const content = await this.$axios.$get('/proxy', {
      params: {
        q: query.src,
      },
    });

    commit('loadFromQuerySuccess', {
      src: query.src,
      content,
    });
  },
  async save({ commit, state }) {
    const res = await this.$axios.$post('/api/bins', {
      files: state.files,
    });

    commit('saveSuccess', res.key);
  },
};
