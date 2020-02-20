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

import { getActiveLanguage } from '@/assets/language.js';
import { save } from '@/assets/home/save.js';

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
        save(this.$store);
      }

      return false;
    });
  },
  methods: {
    getActiveLanguage,
  },
};
</script>
