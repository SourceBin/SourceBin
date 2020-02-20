<template lang="html">
  <div>
    <Editor
      v-model="content"
      :language="getLanguageById(bin.languageId)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Editor from '@/components/editor/Editor.vue';

import { getLanguageById } from '@/assets/language.js';

export default {
  components: {
    Editor,
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
  methods: {
    getLanguageById,
  },
};
</script>
