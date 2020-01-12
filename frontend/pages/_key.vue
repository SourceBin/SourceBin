<template lang="html">
  <div>
    <Header />
    <Editor />
  </div>
</template>

<script>
import Header from '@/components/home/Header.vue';
import Editor from '@/components/home/Editor.vue';

import { meta } from '@/config.js';

export default {
  components: {
    Header,
    Editor,
  },
  async fetch({ error, store, params }) {
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
  head() {
    const { key } = this.$store.state.bin;

    return {
      title: key ? `${meta.title} | ${key}` : meta.title,

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
    return !params.key || /[0-9A-F]{10}/i.test(params.key);
  },
};
</script>
