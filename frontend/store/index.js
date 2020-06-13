import { parse as parseCookies } from 'cookie';

export const actions = {
  async nuxtServerInit({ dispatch }, { req }) {
    const cookies = parseCookies(req.headers.cookie || '');

    if ('access_token' in cookies) {
      try {
        await dispatch('auth/loadUser');
      } catch {} // eslint-disable-line no-empty
    }
  },
};

export const getters = {
  pro(state) {
    return state.auth.user.plan === 'Pro';
  },
};
