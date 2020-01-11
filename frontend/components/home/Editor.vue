<template lang="html">
  <client-only>
    <AceEditor
      id="editor"
      v-model="content"
      language="javascript"
      theme="dracula"
    />
  </client-only>
</template>

<script>
import { mapState } from 'vuex';

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
