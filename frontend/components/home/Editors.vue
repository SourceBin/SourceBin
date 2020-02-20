<template lang="html">
  <div>
    <Editor
      v-model="content"
      :language="getActiveLanguage($store, $route)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Mousetrap from 'mousetrap';
import clipboardCopy from 'clipboard-copy';

import { getActiveLanguage } from '@/assets/language.js';
import { selectLanguage } from '@/assets/home/selectLanguage.js';

export default {
  components: {
    Editor: () => import('@/components/editor/Editor.vue'),
  },
  computed: {
    content: {
      get() {
        return this.bin.content;
      },
      set(value) {
        if (value !== this.bin.content) {
          this.$store.commit('bin/updateContent', value);
        }
      },
    },
    ...mapState(['bin']),
  },
  mounted() {
    Mousetrap.bind('mod+s', (e) => {
      if (!e.repeat) {
        this.save();
      }

      return false;
    });
  },
  methods: {
    getActiveLanguage,
    async save() {
      const languageId = await selectLanguage(this.$store);

      if (languageId) {
        await this.$store.dispatch('bin/save');

        // Update URL with key
        window.history.pushState(null, null, this.$store.state.bin.key);

        // Copy URL to clipboard
        await clipboardCopy(window.location.href);
      }
    },
  },
};
</script>
