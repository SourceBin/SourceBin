<template lang="html">
  <div>
    <Header />
    <Editor />
  </div>
</template>

<script>
import Header from '@/components/home/Header.vue';
import Editor from '@/components/home/Editor.vue';

import { loadBin } from '@/assets/home/loadBin.js';

import { meta } from '@/config.js';

export default {
  components: {
    Header,
    Editor,
  },
  computed: {
    key() {
      return this.$store.state.bin.key;
    },
  },
  watch: {
    key(key) {
      const url = '/';

      // Update URL if the bin is not saved, and the URL is different
      if (key === null && url !== window.location.pathname) {
        window.history.pushState(null, null, url);
      }
    },
  },
  async fetch({ error, store, params }) {
    await loadBin(params.key, error, store);
  },
  mounted() {
    window.addEventListener('popstate', this.handlePopstate);
  },
  beforeDestroy() {
    window.removeEventListener('popstate', this.handlePopstate);
  },
  methods: {
    handlePopstate() {
      loadBin(this.$route.params.key, this.$nuxt.error, this.$store);
    },
  },
  head() {
    const { key } = this.$store.state.bin;

    const head = {
      title: key
        ? `${meta.title} | ${key}`
        : meta.title,

      meta: [
        { name: 'description', hid: 'description', content: meta.description },
      ],

      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap' },
      ],
    };

    // Add OpenGraph if no key is provided
    if (!key) {
      head.meta.push(
        { name: 'og:title', content: meta.title },
        { name: 'og:description', content: meta.description },
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: meta.url },
        { name: 'og:image', content: meta.image },
      );
    }

    return head;
  },
  validate({ params }) {
    return !params.key || /[0-9A-F]{10}/i.test(params.key);
  },
};
</script>
