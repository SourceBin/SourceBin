<template lang="html">
  <div class="toolbar">
    <ul class="info">
      <li
        @click="promptLanguageSelect"
        class="language"
      >
        {{ languageName || 'None' }}
      </li>

      <li
        @click="editFilename = true"
        :style="{ fontStyle: filename ? 'normal' : 'italic' }"
        class="filename"
      >
        <InlineEditable
          :editable.sync="editFilename"

          v-model="filename"
          :props="{ placeholder: 'Filename', maxlength: 100 }"
        >
          {{ filename || 'untitled' }}
        </InlineEditable>
      </li>
    </ul>

    <ul>
      <li
        v-if="isMarkdown"
        @click="$emit('toggleMarkdown')"
      >
        Display {{ displayMarkdown ? 'source' : 'rendered' }}
      </li>

      <li
        v-if="canBeautify && $store.getters.pro"
        @click="$emit('beautify')"
      >
        Format
      </li>

      <li @click="copy">
        Copy
      </li>

      <li
        v-if="bin.saved"
        @click="raw"
      >
        Raw
      </li>

      <li
        v-if="bin.files.length > 1"
        @click="deleteFile"
      >
        Delete
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import clipboardCopy from 'clipboard-copy';

import InlineEditable from '@/components/InlineEditable.vue';

import { getParser } from '@/assets/beautify/beautify.js';
import { isMarkdown } from '@/assets/markdown/markdown.js';
import { promptLanguageSelect } from '@/assets/language.js';

export default {
  components: {
    InlineEditable,
  },
  props: {
    fileIndex: {
      type: Number,
      required: true,
    },
    languageName: {
      type: String,
      default: undefined,
    },
    displayMarkdown: Boolean,
  },
  data() {
    return {
      editFilename: false,
    };
  },
  computed: {
    file() {
      return this.bin.files[this.fileIndex];
    },
    filename: {
      get() {
        return this.file.name || '';
      },
      set(name) {
        this.$store.commit('bin/setName', { name, file: this.fileIndex });
      },
    },

    isMarkdown() {
      return isMarkdown(this.languageName);
    },
    canBeautify() {
      return !!getParser(this.languageName);
    },
    ...mapState(['bin']),
  },
  methods: {
    async promptLanguageSelect() {
      await promptLanguageSelect(this.$store, this.fileIndex);

      this.$emit('focus');
    },
    async copy() {
      await clipboardCopy(this.file.content);
      this.$toast.global.success('Copied content to clipboard');

      this.$emit('focus');
    },
    raw() {
      window.location.href = `/raw/${this.bin.key}/${this.fileIndex}`;
    },
    deleteFile() {
      this.$store.commit('bin/deleteFile', this.fileIndex);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';

$border: 1px solid var(--background-modifier-accent);

.toolbar {
  --height: 40px;

  display: flex;
  justify-content: space-between;
  font-family: var(--font-family);
  font-size: var(--font-size-regular);

  @include mq($until: tablet) {
    --height: 30px;

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
    padding: 0 calc(var(--margin-side) / 2);
    color: var(--text-800);
    opacity: 0.8;
    line-height: var(--height);
    cursor: pointer;

    @include mq($until: tablet) {
      padding: 0 var(--margin-side);
    }

    &:hover {
      background-color: var(--background-modifier-hover);
    }

    &.language {
      min-width: 150px;
      text-align: center;
      border-right: $border;
    }

    &.filename {
      max-width: 150px;
    }
  }
}
</style>
