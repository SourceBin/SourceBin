<template lang="html">
  <client-only>
    <AceEditor
      id="editor"
      v-model="content"
      :language="language"
      theme="dracula"
    />
  </client-only>
</template>

<script>
import { mapState } from 'vuex';
import linguist from 'linguist';

import AceEditor from '@/components/AceEditor.vue';

export default {
  components: {
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
    language() {
      return linguist[this.bin.languageId].aceMode;
    },
    ...mapState(['bin']),
  },
};
</script>

<style lang="scss" scoped>
#editor {
  width: 100vw;
  height: 100vh;
}
</style>
