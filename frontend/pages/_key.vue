<template lang="html">
  <pre>{{ bin.content }}</pre>
</template>

<script>
import { mapState } from 'vuex';

import { meta } from '../config.js';

export default {
  computed: mapState(['bin']),
  watch: {
    'bin.key': function () {
      this.updateUrl();
    },
  },
  async asyncData({ error, store, params }) {
    const { key } = params;

    if (!key) {
      return;
    }

    try {
      await store.dispatch('bin/load', key);
    } catch ({ response }) {
      error({
        statusCode: response.status,
        message: response.data.message,
      });
    }
  },
  methods: {
    updateUrl() {
      window.history.pushState(null, null, this.bin.key);
    },
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
  validate({ params }) {
    return /[0-9A-F]{10}/i.test(params.key);
  },
};
</script>
