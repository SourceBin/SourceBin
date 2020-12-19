<template lang="html">
  <div class="editor">
    <Toolbar
      ref="toolbar"

      :fileIndex="fileIndex"
      :languageName="language ? language.name : undefined"
      :displayMarkdown="displayMarkdown"

      @toggleMarkdown="displayMarkdown = !displayMarkdown"
      @beautify="beautify"
      @focus="focus"
    />

    <client-only>
      <AceEditor
        ref="editor"
        v-show="editorReady && !displayMarkdown"

        :value="file.content"
        @input="updateContent"

        :language="language && language.aceMode"
        :theme="settings.theme"
        :options="options"

        @ready="editorReady = true"

        class="ace"
      />

      <Markdown
        v-if="displayMarkdown"

        :markdown="file.content"

        class="markdown"
      />
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Mousetrap from 'mousetrap';

import Toolbar from './Toolbar.vue';

import { beautify } from '@/assets/beautify/beautify.js';
import { getActiveLanguage } from '@/assets/language.js';

export default {
  components: {
    Toolbar,
    AceEditor: () => import('./AceEditor.vue'),
    Markdown: () => import('./Markdown.vue'),
  },
  props: {
    fileIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      editorReady: false,
      displayMarkdown: false,
    };
  },
  computed: {
    file() {
      return this.bin.files[this.fileIndex];
    },
    language() {
      return getActiveLanguage(this.$store, this.$route, this.fileIndex);
    },
    options() {
      return {
        fontSize: this.settings.fontSize,
        printMargin: this.settings.printMargin,

        fontFamily: 'var(--editor-font-family)',
        useWorker: false,
        minLines: 10,
        maxLines: 10000,
      };
    },
    ...mapState(['bin', 'settings']),
  },
  watch: {
    language() {
      this.displayMarkdown = false;
    },

    editorReady() {
      this.checkReady();
    },
    'bin.status': function () {
      this.checkReady();
    },
  },
  mounted() {
    const mousetrap = new Mousetrap(this.$el);

    mousetrap.bind('mod+l', (e) => {
      if (!e.repeat) {
        this.$refs.toolbar.promptLanguageSelect();
      }

      return false;
    });
  },
  methods: {
    updateContent(content) {
      if (content !== this.file.content) {
        this.$store.commit('bin/updateContent', {
          content,
          file: this.fileIndex,
        });
      }
    },
    async beautify() {
      const toast = this.$toast.show('Formatting');

      try {
        const beautified = await beautify(this.file.content, this.language);

        this.$refs.editor.setValue(beautified);
      } catch (err) {
        this.$toast.global.error(err.message);
      }

      toast.goAway(0);
      this.focus();
    },

    checkReady() {
      if (this.bin.status === 'LOADED' && this.editorReady) {
        this.ready();
      }
    },
    ready() {
      // Focus the first editor when the editor is ready
      if (this.fileIndex === 0 && !this.bin.saved) {
        this.focus();
      }

      this.$emit('ready');
    },

    focus() {
      this.$refs.editor.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';

.editor {
  background-color: var(--background-secondary);
  overflow: hidden;
}

.markdown {
  border-radius: inherit;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border: 1px solid var(--background-secondary);
  border-top: none;
  padding: calc(var(--margin-side) * 1.5);
  background-color: var(--background-primary);
}
</style>
