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

$scrollbar-background: lighten($black, 2%);
$scrollbar-color: $light-gray;

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

body {
  scrollbar-width: thin;
  scrollbar-color: $scrollbar-background $scrollbar-color;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-corner {
  background: $scrollbar-background;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  border: 3px solid $scrollbar-background;
  background: $scrollbar-color;
  background-clip: content-box;
}

::-webkit-scrollbar-track {
  background: $scrollbar-background;
}
</style>
