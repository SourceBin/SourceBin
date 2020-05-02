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
  },
});

export const mutations = {
  loadUserSuccess(state, user) {
    state.loggedIn = true;
    state.user = user;
  },
};

export const actions = {
  async loadUser({ commit }) {
    const user = await this.$axios.$get('/api/user');

    commit('loadUserSuccess', user);
  },
};
