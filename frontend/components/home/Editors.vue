<template lang="html">
  <div class="editors">
    <Loading v-if="loading" />

    <transition-group
      v-show="!loading"
      name="loading"
      tag="div"
    >
      <Editor
        v-for="(file, i) in bin.files"
        :key="file._id"

        :fileIndex="i"
        @ready="loading = false"
      />
    </transition-group>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Mousetrap from 'mousetrap';

import Editor from '@/components/editor/Editor.vue';
import { save } from '@/assets/home/save.js';
import Loading from './Loading.vue';

export default {
  components: {
    Editor,
    Loading,
  },
  data() {
    return {
      loading: true,
    };
  },
  computed: {
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

.editor {
  border-radius: 3px;

  @include mq($until: tablet) {
    border-radius: 0;
  }

  &:not(:last-child) {
    margin-bottom: var(--margin-between);
  }
}
</style>
