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

    <div class="ace-container">
      <client-only>
        <AceEditor
          ref="editor"
          v-model="content"

          :options="{}"
          @ready="() => {}"
          language="javascript"
          theme="dracula"

          class="ace"
        />
      </client-only>
    </div>
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
$border-radius: 5px;

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

.ace-container {
  min-height: 200px;
  position: relative;

  .ace {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
