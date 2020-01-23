<template lang="html">
  <client-only>
    <AceEditor
      id="editor"
      ref="editor"

      v-model="content"
      :language="language"
      :theme="settings.theme"
      @ready="ready"
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
        if (value !== this.bin.content) {
          this.$store.commit('bin/updateContent', value);
        }
      },
    },
    language() {
      return linguist[this.bin.languageId].aceMode;
    },
    ...mapState(['bin', 'settings']),
  },
  methods: {
    ready() {
      // Add mousetrap class to editor textarea to allow keybinds
      Array
        .from(this.$refs.editor.$el.getElementsByTagName('textarea'))
        .forEach(el => el.classList.add('mousetrap'));
    },
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
