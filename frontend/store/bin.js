import { proxyFile } from '@/assets/proxy.js';

function setEdited(state) {
  state.key = undefined;
  state.created = undefined;
  state.saved = false;

  // Update URL if needed
  if (window.location.pathname !== '/') {
    window.history.pushState(null, null, '/');
  }
}

export const state = () => ({
  key: undefined,
  title: undefined,
  description: undefined,
  created: undefined,

  files: [{
    name: undefined,
    content: '',
    languageId: undefined,
  }],

  saved: false,
});

export const mutations = {
  reset(s) {
    Object.assign(s, state());
  },

  setTitle(state, title) {
    state.title = title;
  },
  setDescription(state, description) {
    state.description = description;
  },

  setName(state, { name, file }) {
    state.files[file].name = name;
  },
  updateContent(state, { content, file }) {
    state.files[file].content = content;

    setEdited(state);
  },
  setLanguageId(state, { languageId, file }) {
    state.files[file].languageId = languageId;
  },

  addFile(state) {
    state.files.push({
      name: undefined,
      content: '',
      languageId: undefined,
    });

    setEdited(state);
  },
  deleteFile(state, file) {
    state.files.splice(file, 1);

    setEdited(state);
  },

  loadFromKeySuccess(state, bin) {
    state.key = bin.key;
    state.title = bin.title;
    state.description = bin.description;
    state.created = bin.created;

    state.files = bin.files.map(file => ({
      name: file.name,
      content: file.content || '',
      languageId: file.languageId,
    }));

    state.saved = true;
  },
  loadFromQuerySuccess(state, external) {
    state.key = external.src;

    state.files = [{
      name: external.src.substring(external.src.lastIndexOf('/') + 1),
      content: external.content || '',
      languageId: undefined,
    }];

    state.saved = true;
  },

  saveSuccess(state, { key, languages }) {
    state.key = key;

    for (let i = 0; i < languages.length; i += 1) {
      state.files[i].languageId = languages[i];
    }

    state.saved = true;
  },
};

export const actions = {
  async loadFromKey({ commit }, { key, content }) {
    const bin = await this.$axios.$get(`/api/bins/${key}`, {
      params: {
        content,
      },
    });

    commit('loadFromKeySuccess', bin);
  },
  async loadFromQuery({ commit }, src) {
    const file = await proxyFile(src, this.$axios);

    commit('loadFromQuerySuccess', {
      src,
      content: file.content,
    });
  },
  async save({ commit, state }) {
    const res = await this.$axios.$post('/api/bins', {
      title: state.title,
      description: state.description,
      files: state.files,
    });

    commit('saveSuccess', res);
  },
};
