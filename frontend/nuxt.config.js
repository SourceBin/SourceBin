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
    ],
  },

  loading: { color: meta.themeColor },

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],

  plugins: [
    '@/plugins/eventBus.js',
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
