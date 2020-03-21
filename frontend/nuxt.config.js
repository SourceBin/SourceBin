/* eslint-disable no-param-reassign */

import { meta } from './config.js';

export default {
  buildDir: 'dist',
  mode: 'universal',

  head: {
    titleTemplate: x => (x ? `${x} | SourceBin` : 'SourceBin'),
    htmlAttrs: { lang: 'en' },

    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },

      // Site information
      { name: 'description', hid: 'description', content: meta.description },

      // Open Graph
      { name: 'og:title', hid: 'og:title', content: meta.title },
      { name: 'og:description', hid: 'og:description', content: meta.description },
      { name: 'og:type', hid: 'og:type', content: 'website' },
      { name: 'og:url', hid: 'og:url', content: meta.url },
      { name: 'og:image', hid: 'og:image', content: meta.image },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap' },
    ],
  },

  loading: { color: meta.themeColor },

  css: [
    '@sourcebin/fonts/dist/index.css',
  ],

  modules: [
    '@nuxtjs/device',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
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
    extend(config) {
      config.output.globalObject = 'this';

      config.module.rules.push({
        test: /\.worker\.js$/,
        loader: 'worker-loader',
      });
    },
    transpile: [
      'lodash-es',
    ],
  },
};
