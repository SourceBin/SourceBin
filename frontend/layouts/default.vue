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

.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: $black;
}
</style>
