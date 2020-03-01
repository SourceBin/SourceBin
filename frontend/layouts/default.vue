<template>
  <div class="default-layout">
    <Header />
    <nuxt />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
  components: {
    Header,
  },
};
</script>

<style lang="scss">
@import 'normalize.css';
@import '@/assets/_globals.scss';
@import '@/assets/_toasted.scss';

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#__nuxt,
#__layout {
  height: 100%;
}

.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: $black;
}
</style>
