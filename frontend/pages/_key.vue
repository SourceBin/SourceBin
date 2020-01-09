<template lang="html">
  <pre>{{ bin.content }}</pre>
</template>

<script>
import { mapState } from 'vuex';

import { meta } from '../config.js';

export default {
  computed: mapState(['bin']),
  async asyncData({ redirect, store, params }) {
    const { key } = params;

    if (!key) {
      return;
    }

    try {
      await store.dispatch('bin/load', key);
    } catch (err) {
      redirect('/');
    }
  },
  head() {
    return {
      title: this.bin.key
        ? `${meta.title} | ${this.bin.key}`
        : meta.title,

      meta: [
        { name: 'description', hid: 'description', content: meta.description },

        // Open Graph
        { name: 'og:title', content: meta.title },
        { name: 'og:description', content: meta.description },
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: meta.url },
        { name: 'og:image', content: meta.image },
      ],
    };
  },
};
</script>
