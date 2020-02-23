<template lang="html">
  <div class="settings">
    <h1>Settings</h1>

    <EditorSettings />

    <Selector />
  </div>
</template>

<script>
import EditorSettings from '@/components/settings/EditorSettings.vue';

export default {
  components: {
    EditorSettings,
    Selector: () => import('@/components/Selector.vue'),
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
