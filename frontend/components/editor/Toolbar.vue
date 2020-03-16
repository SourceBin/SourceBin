<template lang="html">
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
        @click="$emit('toggleMarkdown')"
      >
        Display {{ displayMarkdown ? 'source' : 'rendered' }}
      </li>

      <li
        v-if="canBeautify"
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
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import clipboardCopy from 'clipboard-copy';

import { getParser } from '@/assets/beautify/beautify.js';
import { isMarkdown } from '@/assets/markdown/markdown.js';
import { promptLanguageSelect } from '@/assets/language.js';

export default {
  props: {
    fileIndex: {
      type: Number,
      required: true,
    },
    language: {
      type: Object,
      required: true,
    },
    displayMarkdown: Boolean,
  },
  computed: {
    file() {
      return this.$store.state.bin.files[this.fileIndex];
    },
    isMarkdown() {
      return isMarkdown(this.language);
    },
    canBeautify() {
      return getParser(this.language) !== undefined;
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

$border: 1px solid $light-gray;

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
</style>
