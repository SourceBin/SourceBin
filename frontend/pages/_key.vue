<template lang="html">
  <div>
    <Navbar>
      <li>Save</li>
      <li>New</li>
      <li>Language</li>
      <li>Theme</li>
      <li>Settings</li>
    </Navbar>

    <client-only>
      <AceEditor
        id="editor"
        v-model="content"
        language="javascript"
        theme="dracula"
      />
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Navbar from '@/components/Navbar.vue';
import AceEditor from '@/components/AceEditor.vue';

import { meta } from '../config.js';

export default {
  components: {
    Navbar,
    AceEditor,
  },
  computed: {
    content: {
      get() {
        return this.bin.content;
      },
      set(value) {
        this.$store.commit('bin/updateContent', value);
      },
    },
    ...mapState(['bin']),
  },
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
      window.history.pushState(null, null, this.bin.key || '/');
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
    return !params.key || /[0-9A-F]{10}/i.test(params.key);
  },
};
</script>

<style lang="scss">
#editor {
  width: 100vw;
  height: 100vh;
}
</style>
