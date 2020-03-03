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
  width: 500px;
  font-family: $font-family;
  color: rgba($white, 0.9);
  margin: 0 auto;

  @include mq($until: tablet) {
    width: auto;
    margin: 0 $margin-side-small;
  }
}
</style>
