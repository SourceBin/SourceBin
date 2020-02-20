<template lang="html">
  <div class="editor">
    <div class="toolbar">
      <ul>
        <li class="language">
          {{ language.name }}
        </li>
        <li>untitled</li>
      </ul>

      <ul>
        <li>Copy</li>
        <li>Format</li>
        <li>Raw</li>
      </ul>
    </div>

    <client-only>
      <AceEditor
        ref="editor"
        :value="value"
        @input="$emit('input', $event)"

        :language="language.aceMode"
        :theme="settings.theme"
        :options="options"

        @ready="ready"
      />
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import AceEditor from './AceEditor.vue';

export default {
  components: {
    AceEditor,
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
  computed: {
    options() {
      return {
        minLines: 10,
        maxLines: 50,

        fontSize: this.settings.fontSize,
        showPrintMargin: this.settings.printMargin,
        useWorker: false,
      };
    },
    ...mapState(['settings']),
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
@import '@/assets/_globals.scss';

$height: 40px;
$font-size: 15px;
$border-radius: 3px;

.editor {
  margin: 25px 50px;
  background: $gray;
  border-radius: $border-radius;
  overflow: hidden;
}

.toolbar {
  height: $height;
  display: flex;
  justify-content: space-between;
  font-family: $font-family;
  font-size: $font-size;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    float: left;
    padding: 0 15px;
    color: $white;
    opacity: 80%;
    line-height: $height;
    cursor: pointer;

    &:hover {
      background-color: $light-gray;
    }

    &.language {
      min-width: 150px;
      text-align: center;
      border-right: 1px solid $light-gray;
    }
  }
}
</style>
