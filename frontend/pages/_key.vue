<template lang="html">
  <div class="homepage">
    <Editors />
    <Actions />

    <Selector
      :options="languageOptions"
      title="Language Selector"
    />
  </div>
</template>

<script>
import { linguist } from '@sourcebin/linguist';

import Editors from '@/components/home/Editors.vue';
import Actions from '@/components/home/Actions.vue';

import { loadBin } from '@/assets/home/loadBin.js';

import { meta } from '@/config.js';

export default {
  components: {
    Editors,
    Actions,
    Selector: () => import('@/components/Selector.vue'),
  },
  data() {
    return {
      languageOptions: Object
        .entries(linguist)
        .map(([id, language]) => ({
          name: language.name,
          aliases: language.aliases,
          data: Number(id),
        })),
    };
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
      title: key
        ? `${meta.title} | ${key}`
        : meta.title,

      meta: [
        { name: 'description', hid: 'description', content: meta.description },
      ],

      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap' },
      ],
    };

    // Add OpenGraph if no key is provided
    if (!key) {
      head.meta.push(
        { name: 'og:title', content: meta.title },
        { name: 'og:description', content: meta.description },
        { name: 'og:type', content: 'website' },
        { name: 'og:url', content: meta.url },
        { name: 'og:image', content: meta.image },
      );
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
