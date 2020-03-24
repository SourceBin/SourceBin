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

    <Selector
      :options="fontOptions"
      event-name="promptFontSelect"
      title="Font Selector"
    />
  </div>
</template>

<script>
import Mousetrap from 'mousetrap';

import EditorSettings from '@/components/settings/EditorSettings.vue';

import { languageOptions, themeOptions, fontOptions } from '@/assets/selector/options.js';

export default {
  components: {
    EditorSettings,
    Selector: () => import('@/components/overlay/Selector.vue'),
  },
  data() {
    return {
      languageOptions,
      themeOptions,
      fontOptions,
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
