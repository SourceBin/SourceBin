<template lang="html">
  <div class="settings">
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
@import '@/assets/_globals.scss';

.settings {
  font-family: $font-family;
}
</style>
