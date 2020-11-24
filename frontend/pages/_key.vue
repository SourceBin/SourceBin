<template lang="html">
  <div class="homepage">
    <div class="homepage-top">
      <About />
      <CarbonAds v-if="showAds" />
    </div>
    <Editors />
    <Actions />

    <CarbonAdsText
      v-if="showAds"
      class="carbon-text"
    />

    <Selector
      :options="languageOptions"
      event-name="promptLanguageSelect"
      title="Language Selector"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import About from '@/components/home/About.vue';
import Editors from '@/components/home/Editors.vue';
import Actions from '@/components/home/Actions.vue';

import CarbonAds from '@/components/ads/CarbonAds.vue';
import CarbonAdsText from '@/components/ads/CarbonAdsText.vue';

import { languageOptions } from '@/assets/selector/options.js';

export default {
  components: {
    About,
    Editors,
    Actions,
    CarbonAds,
    CarbonAdsText,
    Selector: () => import('@/components/overlay/Selector.vue'),
  },
  data() {
    return {
      languageOptions,
    };
  },
  computed: {
    key() {
      return this.bin.key;
    },
    showAds() {
      return !this.$store.getters.pro || this.$store.state.settings.showAds;
    },
    ...mapState(['bin']),
  },
  async fetch({ route, store, error }) {
    if (route.params.key) {
      // If a key is provided the bin is loaded, but the content is excluded. This
      // allows metadata to be displayed on bin load, and the content itself to be
      // loaded afterwards.
      try {
        await store.dispatch('bin/loadMetadataFromKey', route.params.key);
      } catch (err) {
        error({
          statusCode: err.response.status,
          message: err.response.data.message,
        });
      }
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
      if (this.$route.params.key) {
        try {
          // Load the bin metadata if the key is not set
          if (!this.key) {
            await this.$store.dispatch('bin/loadMetadataFromKey', this.$route.params.key);
          }

          await this.$store.dispatch('bin/loadBinFiles');
        } catch (err) {
          this.$nuxt.error({
            statusCode: err.response.status,
            message: err.response.data.message,
          });
        }
      } else if (this.$route.query.src) {
        const { src } = this.$route.query;

        try {
          await this.$store.dispatch('bin/loadFromQuery', src);
        } catch (err) {
          this.$nuxt.error({
            statusCode: err.response.status,
            message: `Failed to load from '${src}': ${err.response.data}`,
          });
        }
      }
    },
  },
  head() {
    const head = {
      title: this.key,
    };

    if (this.bin.title || this.bin.description) {
      head.meta = [
        { name: 'description', hid: 'description', content: this.bin.description },

        { name: 'og:title', hid: 'og:title', content: this.bin.title },
        { name: 'og:description', hid: 'og:description', content: this.bin.description },
      ];
    } else if (process.server && (this.key || this.$route.query.src)) {
      // Remove site information when ssr and a bin is provided
      head.meta = [
        { hid: 'description', content: null },

        { hid: 'og:site_name', content: null },
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
    return !params.key || /^[0-9A-Z]{10}$/i.test(params.key);
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';

.homepage {
  display: flex;
  flex-direction: column;

  > *:not(.overlay) {
    margin: 0 var(--margin-side) var(--margin-between);

    @include mq($until: tablet) {
      &:not(.actions) {
        margin: 0 0 var(--margin-between);
      }
    }
  }
}

.homepage-top {
  display: flex;
  align-items: center;

  @include mq($until: desktop) {
    flex-direction: column;
  }

  > :first-child {
    @include mq($from: desktop) {
      margin-right: var(--margin-between);
    }

    @include mq($until: desktop) {
      margin-bottom: var(--margin-between);
    }
  }
}

.carbon-text {
  margin: auto 0 0 0 !important;
  align-self: center;

  /deep/ .native-box {
    margin-bottom: var(--margin-between);
  }
}
</style>
