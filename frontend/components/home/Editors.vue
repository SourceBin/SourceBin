<template lang="html">
  <div class="editors">
    <Editor
      ref="editors"

      v-for="(file, index) in bin.files"
      :key="index"

      :value="file.content"
      @input="updateContent($event, index)"

      :language="getActiveLanguage($store, $route, index)"

      @ready="index === 0 && !bin.saved ? focus(0) : null"
      @promptLanguageSelect="promptLanguageSelect(index)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Mousetrap from 'mousetrap';

import { getActiveLanguage, promptLanguageSelect } from '@/assets/language.js';
import { save } from '@/assets/home/save.js';

export default {
  components: {
    Editor: () => import('@/components/editor/Editor.vue'),
  },
  computed: mapState(['bin']),
  mounted() {
    Mousetrap.bind('mod+s', (e) => {
      if (!e.repeat) {
        save(this);
      }

      return false;
    });
  },
  methods: {
    getActiveLanguage,

    async promptLanguageSelect(file) {
      await promptLanguageSelect(this.$store, file);
      this.focus(file);
    },

    updateContent(content, file) {
      if (content !== this.bin.files[file].content) {
        this.$store.commit('bin/updateContent', {
          content,
          file,
        });
      }
    },

    focus(file) {
      this.$refs.editors[file].focus();
    },
  },
};
</script>

<style lang="scss" scoped>
.editors {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
