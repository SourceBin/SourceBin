/* eslint-disable no-param-reassign */

import { meta, GA_ID } from './config.js';
import { renderer as markdownRenderer } from './assets/markdown/renderer.js';

export default {
  buildDir: 'dist',

  head: {
    titleTemplate: x => (x ? `${x} | SourceBin` : 'SourceBin'),
    htmlAttrs: { lang: 'en' },

    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },

      // Site information
      { name: 'description', hid: 'description', content: meta.description },

      // Open Graph
      { name: 'og:site_name', hid: 'og:site_name', content: meta.siteName },
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
    ['nuxt-fontawesome', {
      imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['fas'],
        },
        {
          set: '@fortawesome/free-brands-svg-icons',
          icons: ['fab'],
        },
      ],
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

  buildModules: [
    ['@nuxtjs/google-analytics', {
      id: GA_ID,
    }],
  ],

  axios: {
    baseURL: 'http://nginx:80/',
    browserBaseURL: '/',
  },

  plugins: [
    { src: '@/plugins/filters.js' },

    { src: '@/plugins/localStorage.js', mode: 'client' },

    { src: '@/plugins/ssr-cookie-proxy.js', mode: 'server' },
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

  env: {
    CDN_BASE_URL: process.env.CDN_BASE_URL,
  },

  build: {
    extend(config) {
      config.output.globalObject = 'this';

      config.module.rules.push({
        test: /\.worker\.js$/,
        loader: 'worker-loader',
      });

      config.module.rules.push({
        test: /\.md$/,
        use: [
          'html-loader',
          {
            loader: 'markdown-loader',
            options: {
              gfm: true,
              renderer: markdownRenderer,
            },
          },
        ],
      });
    },
    transpile: [
      'lodash-es',
    ],
  },
};
