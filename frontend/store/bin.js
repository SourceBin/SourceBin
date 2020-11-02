import { languages } from '@sourcebin/linguist';
import { proxyFile } from '@/assets/proxy.js';

function setEdited(state) {
  state.key = undefined;
  state.created = undefined;
  state.saved = false;

  // Update URL if needed
  if (window.location.pathname !== '/' || window.$nuxt.$route.query.src) {
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

  loadMetadataFromKeySuccess(state, data) {
    state.key = data.key;
    state.title = data.title;
    state.description = data.description;
    state.created = data.created;

    state.files = data.files.map(file => ({
      name: file.name,
      content: '',
      languageId: file.languageId,
    }));

    state.saved = true;
  },
  loadBinFilesSuccess(state, files) {
    files.forEach((file, i) => {
      state.files[i].content = file;
    });
  },
  loadFromQuerySuccess(state, external) {
    state.key = external.src;

    state.files = [{
      name: external.src.substring(external.src.lastIndexOf('/') + 1),
      content: external.content || '',
      languageId: languages[external.language],
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
  async loadMetadataFromKey({ commit }, key) {
    const data = await this.$axios.$get(`/api/bins/${key}`, {
      params: {
        content: false,
      },
    });

    commit('loadMetadataFromKeySuccess', data);
  },
  async loadBinFiles({ commit, state }) {
    const files = await Promise.all(
      state.files.map((_, i) => this.$axios.$get(`${process.env.CDN_BASE_URL}/bins/${state.key}/${i}`, {
        transformResponse: x => x, // axios always tries JSON.parse: https://github.com/axios/axios/issues/907
      })),
    );

    commit('loadBinFilesSuccess', files);
  },
  async loadFromQuery({ commit }, src) {
    const file = await proxyFile(src, this.$axios);

    commit('loadFromQuerySuccess', {
      src,
      content: file.content,
      language: file.language,
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
