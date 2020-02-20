<template lang="html">
  <div class="editor">
    <div class="toolbar">
      <ul>
        <li class="language">
          JavaScipt
        </li>
        <li>index.js</li>
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
        v-model="content"

        :options="{ minLines: 10,maxLines: 50 }"
        language="javascript"
        theme="dracula"
      />
    </client-only>
  </div>
</template>

<script>
import AceEditor from './AceEditor.vue';

export default {
  components: {
    AceEditor,
  },
  computed: {
    content: {
      get() {
        return 'this.bin.content';
      },
      set(value) {
        console.log(value);
      },
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
  margin: 0 50px;
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
