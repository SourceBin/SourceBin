<template lang="html">
  <div class="settings">
    <h1>Settings</h1>

    <EditorSettings />

    <Selector
      :options="languageOptions"
      event-name="promptLanguageSelect"
      title="Language Selector"
    />
    <Selector
      :options="themeOptions"
      event-name="promptThemeSelect"
      title="Theme Selector"
    />
  </div>
</template>

<script>
import Mousetrap from 'mousetrap';

import EditorSettings from '@/components/settings/EditorSettings.vue';

import { languageOptions, themeOptions } from '@/assets/selector/options.js';

export default {
  components: {
    EditorSettings,
    Selector: () => import('@/components/Selector.vue'),
  },
  data() {
    return {
      languageOptions,
      themeOptions,
    };
  },
  mounted() {
    Mousetrap.bind('esc', () => this.$router.push('/'));
  },
  beforeDestroy() {
    Mousetrap.unbind('esc');
  },
  head() {
    return {
      title: 'Settings',
    };
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/_globals.scss';

.settings {
  width: 750px;
  font-family: $font-family;
  color: rgba($white, 0.9);
  margin: 0 auto;

  @include mq($until: tablet) {
    width: auto;
    margin: 0 $margin-side-small;
  }
}
</style>
