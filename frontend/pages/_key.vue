<template lang="html">
  <pre>{{ bin ? bin.content : '' }}</pre>
</template>

<script>
import { meta } from '../config.js';

export default {
  head() {
    return {
      title: meta.title,
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
  async asyncData({ $axios, params }) {
    const { key } = params;

    const bin = await $axios.$get(`/bins/${key}`).catch(() => undefined);
    return { bin };
  },
};
</script>
