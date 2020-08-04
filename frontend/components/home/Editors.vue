<template lang="html">
  <div>
    <Loading v-if="loading" />

    <transition
      name="loading"
      appear
    >
      <Editor
        v-show="!loading"
        v-for="(_, i) in bin.files"
        :key="i"
        :fileIndex="i"
        @ready="editorLoading = false"
      />
    </transition>
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
.loading-enter-active {
  animation: fade-in ease 0.3s;
}
</style>
