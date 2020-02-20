<template lang="html">
  <div class="homepage">
    <Header />
    <Editor />
    <Actions />
  </div>
</template>

<script>
import Header from '@/components/home/Header.vue';
import Actions from '@/components/home/Actions.vue';
import Editor from '@/components/editor/Editor.vue';

import { loadBin } from '@/assets/home/loadBin.js';

import { meta } from '@/config.js';

export default {
  components: {
    Header,
    Editor,
    Actions,
  },
  async fetch({ route, store, error }) {
    await loadBin(route, store, error);
  },
  mounted() {
    window.addEventListener('popstate', this.handlePopstate);
  },
  beforeDestroy() {
    window.removeEventListener('popstate', this.handlePopstate);
  },
  methods: {
    handlePopstate() {
      loadBin(this.$route, this.$store, this.$nuxt.error);
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

<style lang="scss" scoped>
@import '@/assets/_globals.scss';

.homepage {
  padding-bottom: 25px;
  min-height: 100vh;
  background-color: $black;
}
</style>
