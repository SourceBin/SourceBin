<template lang="html">
  <div class="editors">
    <Loading v-if="loading" />

    <!-- TODO: use transition-group here instead. This requires :key to not be the v-for index -->
    <div
      v-show="!loading"
      v-for="(file, i) in bin.files"
      :key="i"
    >
      <transition
        name="loading"
        appear
      >
        <Editor
          :fileIndex="i"
          @ready="editorLoading = false"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Mousetrap from 'mousetrap';

import Loading from './Loading.vue';

import { save } from '@/assets/home/save.js';

export default {
  components: {
    Loading,
    Editor: () => import('@/components/editor/Editor.vue'),
  },
  data() {
    return {
      editorLoading: true,
    };
  },
  computed: {
    loading() {
      return this.editorLoading
        || (this.bin.key && !this.bin.files.some(file => file.content !== undefined));
    },
    ...mapState(['bin']),
  },
  mounted() {
    Mousetrap.bind('mod+s', (e) => {
      if (!e.repeat) {
        save(this);
      }

      return false;
    });
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';

.loading-enter-active {
  animation: fade-in ease 0.3s;
}

.editors > :not(:last-child) {
  margin-bottom: var(--margin-between);
}

.editor {
  border-radius: 3px;

  @include mq($until: tablet) {
    border-radius: 0;
  }
}
</style>
