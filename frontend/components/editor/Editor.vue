<template lang="html">
  <client-only>
    <div class="editor">
      <div class="toolbar">
        <ul class="info">
          <li
            @click="promptLanguageSelect"
            class="language"
          >
            {{ language.name }}
          </li>

          <!-- <li>untitled</li> -->
        </ul>

        <ul>
          <li
            v-if="isMarkdown"
            @click="displayMarkdown = !displayMarkdown"
          >
            Display {{ displayMarkdown ? 'source' : 'rendered' }}
          </li>

          <li @click="copy">
            Copy
          </li>

          <!-- <li>Format</li>
          <li>Raw</li> -->
        </ul>
      </div>

      <AceEditor
        ref="editor"
        :value="value"
        @input="$emit('input', $event)"

        :language="language.aceMode"
        :theme="settings.theme"
        :options="options"

        v-show="editorReady && !displayMarkdown"
        @ready="ready"

        class="ace"
      />

      <Markdown
        v-if="isMarkdown"
        v-show="displayMarkdown"

        :markdown="value"

        class="markdown"
      />
    </div>
  </client-only>
</template>

<script>
import { mapState } from 'vuex';
import Mousetrap from 'mousetrap';
import clipboardCopy from 'clipboard-copy';

import AceEditor from './AceEditor.vue';
import Markdown from './Markdown.vue';

import { promptLanguageSelect } from '@/assets/language.js';
import { isMarkdown } from '@/assets/markdown/markdown.js';

export default {
  components: {
    AceEditor,
    Markdown,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    language: {
      type: Object,
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
    isMarkdown() {
      return isMarkdown(this.language);
    },
    options() {
      return {
        fontSize: this.settings.fontSize,
        showPrintMargin: this.settings.printMargin,
        useWorker: false,
      };
    },
    ...mapState(['settings']),
  },
  watch: {
    language() {
      this.displayMarkdown = false;
    },
  },
  mounted() {
    const mousetrap = new Mousetrap(this.$el);

    mousetrap.bind('mod+l', (e) => {
      if (!e.repeat) {
        this.promptLanguageSelect();
      }

      return false;
    });
  },
  methods: {
    async promptLanguageSelect() {
      await promptLanguageSelect(this.$store);
      this.focus();
    },
    ready() {
      // Add mousetrap class to editor textarea to allow keybinds
      Array
        .from(this.$refs.editor.$el.getElementsByTagName('textarea'))
        .forEach(el => el.classList.add('mousetrap'));

      this.editorReady = true;
      this.$emit('ready');
    },
    focus() {
      this.$refs.editor.focus();
    },
    async copy() {
      await clipboardCopy(this.value);
      this.$toast.global.success('Copied content to clipboard');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/_globals.scss';

$height: 40px;
$height-small: 30px;

$font-size: 15px;
$font-size-small: 13px;

$border-radius: 5px;
$border: 1px solid $light-gray;

.editor {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: 10px $margin-side 25px;
  background: $gray;
  border-radius: $border-radius;
  overflow: hidden;

  @include mq($until: desktop) {
    margin: 0 0 15px;
    border-radius: 0;
  }
}

.toolbar {
  display: flex;
  justify-content: space-between;
  font-family: $font-family;
  font-size: $font-size;
  border-bottom: $border;

  @include mq($until: tablet) {
    font-size: $font-size-small;
    flex-direction: column;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    &.info {
      @include mq($until: tablet) {
        border-bottom: $border;
      }
    }
  }

  li {
    float: left;
    padding: 0 15px;
    color: $white;
    opacity: 0.8;
    line-height: $height;
    cursor: pointer;

    @include mq($until: tablet) {
      padding: 0 10px;
      line-height: $height-small;
    }

    &:hover {
      background-color: $light-gray;
    }

    &.language {
      min-width: 150px;
      text-align: center;
      border-right: $border;
    }
  }
}

.ace,
.markdown {
  flex: 1;
}
</style>
