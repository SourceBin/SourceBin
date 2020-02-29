<template lang="html">
  <div class="homepage">
    <Editors />
    <Actions />

    <Selector />
  </div>
</template>

<script>
import Editors from '@/components/home/Editors.vue';
import Actions from '@/components/home/Actions.vue';

import { loadBin } from '@/assets/home/loadBin.js';

export default {
  components: {
    Editors,
    Actions,
    Selector: () => import('@/components/Selector.vue'),
  },
  async fetch({ route, store, error }) {
    await loadBin(route, store, error);
  },
  mounted() {
    window.addEventListener('popstate', this.handlePopstate);
  },
  beforeDestroy() {
    window.removeEventListener('popstate', this.handlePopstate);
  },
  methods: {
    handlePopstate() {
      loadBin(this.$route, this.$store, this.$nuxt.error);
    },
  },
  head() {
    const { key } = this.$store.state.bin;

    const head = {
      title: key,

      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap' },
      ],
    };

    // Remove site information when ssr, and a key is provided
    if (key && process.server) {
      head.meta = [
        { hid: 'description', content: null },

        // Open Graph
        { hid: 'og:title', content: null },
        { hid: 'og:description', content: null },
        { hid: 'og:type', content: null },
        { hid: 'og:url', content: null },
        { hid: 'og:image', content: null },
      ];
    }

    return head;
  },
  validate({ params }) {
    return !params.key || /[0-9A-F]{10}/i.test(params.key);
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/_globals.scss';

.homepage {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 25px;

  @include mq($until: desktop) {
    padding-bottom: 15px;
  }
}
</style>
