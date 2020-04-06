export const state = () => ({
  loggedIn: false,

  user: {
    username: undefined,

    about: {
      avatarURL: undefined,
      bio: undefined,
      website: undefined,
      location: undefined,
    },

    oauth: {
      discord: undefined,
      github: undefined,
    },

    bins: [],
  },
});

export const mutations = {
  loadUserSuccess(state, { user, bins }) {
    state.loggedIn = true;
    state.user = { ...user, bins };
  },
};

export const actions = {
  async loadUser({ commit }) {
    const user = await this.$axios.$get('/api/user');
    const bins = await this.$axios.$get('/api/user/bins');

    commit('loadUserSuccess', { user, bins });
  },
};
