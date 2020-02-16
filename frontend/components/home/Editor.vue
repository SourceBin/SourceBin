<template lang="html">
  <client-only>
    <AceEditor
      ref="editor"
      v-model="content"

      :language="language"
      :theme="settings.theme"
      :options="options"
      @ready="ready"

      class="ace-editor"
    />
  </client-only>
</template>

<script>
import { mapState } from 'vuex';

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
      return this.$store.getters.language.aceMode;
    },
    options() {
      return {
        fontSize: this.settings.fontSize,
        showPrintMargin: this.settings.printMargin,
        useWorker: false,
      };
    },
    ...mapState(['bin', 'settings']),
  },
  mounted() {
    this.$eventBus.$on('focusEditor', this.focusEditor);
  },
  beforeDestroy() {
    this.$eventBus.$off('focusEditor', this.focusEditor);
  },
  methods: {
    ready() {
      // Add mousetrap class to editor textarea to allow keybinds
      Array
        .from(this.$refs.editor.$el.getElementsByTagName('textarea'))
        .forEach(el => el.classList.add('mousetrap'));

      // Only focus on desktop or empty bins
      if (this.$device.isDesktop || !this.bin.key) {
        this.$eventBus.$emit('focusEditor');
      }
    },
    focusEditor() {
      this.$refs.editor.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
.ace-editor {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
