<template lang="html">
  <div class="editors">
    <Editor
      v-for="(_, fileIndex) in bin.files"
      :key="fileIndex"
      :fileIndex="fileIndex"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Mousetrap from 'mousetrap';

import { save } from '@/assets/home/save.js';

export default {
  components: {
    Editor: () => import('@/components/editor/Editor.vue'),
  },
  computed: mapState(['bin']),
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
