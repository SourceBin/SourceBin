import { meta } from './config.js';

export default {
  buildDir: 'build',
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

  manifest: {
    name: meta.title,
    description: meta.description,
  },
};