<template lang="html">
  <client-only>
    <AceEditor
      id="editor"
      v-model="content"
      :language="language"
      :theme="settings.theme"
    />
  </client-only>
</template>

<script>
import { mapState } from 'vuex';
import { linguist } from 'linguist';

export default {
  components: {
    AceEditor: () => import('@/components/AceEditor.vue'),
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
    ...mapState(['bin', 'settings']),
  },
};
</script>

<style lang="scss" scoped>
#editor {
  width: 100vw;
  // TODO: Make the editor 100% of the remaining height
  height: calc(100vh - 30px);
}
</style>
