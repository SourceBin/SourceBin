import { meta } from './config.js';

export default {
  buildDir: 'dist',
  mode: 'universal',

  head: {
    htmlAttrs: { lang: 'en' },

    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap' },
    ],
  },

  loading: { color: meta.themeColor },

  modules: [
    '@nuxtjs/device',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    ['nuxt-fontawesome', {
      imports: [{
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas'],
      }],
    }],
    ['@nuxtjs/toast', {
      register: [
        {
          name: 'success',
          message: msg => msg,
          options: {
            type: 'success',
            duration: 5000,
          },
        },
        {
          name: 'error',
          message: msg => msg,
          options: {
            type: 'error',
            duration: 5000,
          },
        },
      ],
    }],
  ],

  plugins: [
    { src: '@/plugins/localStorage.js', mode: 'client' },
  ],

  meta: {
    ogType: false,
    ogSiteName: false,
    ogTitle: false,
    ogDescription: false,
    ogHost: false,
    ogImage: false,
    ogUrl: false,
  },

  manifest: {
    name: meta.title,
    short_name: meta.title,
    description: meta.description,
  },

  build: {
    transpile: [
      'lodash-es',
    ],
  },
};
