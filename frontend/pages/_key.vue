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
  async fetch({ route, store }) {
    if (route.params.key) {
      // If a key is provided the bin is loaded, but the content is excluded. This
      // allows metadata to be displayed on bin load, and the content itself to be
      // loaded afterwards.
      await store.dispatch('bin/loadFromKey', {
        key: route.params.key,
        content: false,
      });
    } else if (store.state.bin.key) {
      // If there is a key the bin is reset. This is to prevent content from a different
      // bin being displayed.
      store.commit('bin/reset');
    }
  },
  async mounted() {
    window.addEventListener('popstate', this.handlePopstate);

    await this.loadBin();
  },
  beforeDestroy() {
    window.removeEventListener('popstate', this.handlePopstate);
  },
  methods: {
    async handlePopstate() {
      await this.loadBin();
    },
    async loadBin() {
      try {
        if (this.$route.params.key) {
          await this.$store.dispatch('bin/loadFromKey', {
            key: this.$route.params.key,
          });
        } else if (this.$route.query.src) {
          await this.$store.dispatch('bin/loadFromQuery', this.$route.query);
        }
      } catch (err) {
        this.$nuxt.error({
          statusCode: err.response.status,
          message: err.response.data.message,
        });
      }
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
