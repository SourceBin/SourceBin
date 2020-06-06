<template lang="html">
  <div class="homepage">
    <div class="homepage-top">
      <About />
      <CarbonAds v-if="!$store.getters.pro" />
    </div>
    <Editors />
    <Actions />

    <Selector
      :options="languageOptions"
      event-name="promptLanguageSelect"
      title="Language Selector"
    />
  </div>
</template>

<script>
import About from '@/components/home/About.vue';
import CarbonAds from '@/components/home/CarbonAds.vue';
import Editors from '@/components/home/Editors.vue';
import Actions from '@/components/home/Actions.vue';

import { loadBin } from '@/assets/home/loadBin.js';
import { languageOptions } from '@/assets/selector/options.js';

export default {
  components: {
    About,
    CarbonAds,
    Editors,
    Actions,
    Selector: () => import('@/components/overlay/Selector.vue'),
  },
  data() {
    return {
      languageOptions,
    };
  },
  computed: {
    key() {
      return this.$store.state.bin.key;
    },
  },
  watch: {
    key(key) {
      if (!key && window.location.pathname !== '/') {
        window.history.pushState(null, null, '/');
      }
    },
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
    const head = {
      title: this.key,
    };

    // Remove site information when ssr, and a key is provided
    if (this.key && process.server) {
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

.homepage {
  padding-bottom: 15px;
}

.homepage-top {
  display: flex;
  align-items: center;
  margin: 0 var(--margin-side) var(--margin-between);

  @include mq($until: desktop) {
    flex-direction: column;
  }

  @include mq($until: tablet) {
    margin: 0 0 var(--margin-between);
  }
}
</style>
