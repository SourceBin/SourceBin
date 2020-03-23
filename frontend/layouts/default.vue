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
  scrollbar-color: $scrollbar-color $scrollbar-background;
}

::-webkit-scrollbar {
  width: 12px;
  height: 10px;
}

::-webkit-scrollbar-corner {
  background: $scrollbar-background;
}

::-webkit-scrollbar-track {
  background: $scrollbar-background;
}

::-webkit-scrollbar-thumb {
  border: 4px solid $scrollbar-background;
  border-radius: 7px;
  background: $scrollbar-color;
  background-clip: content-box;

  &:active {
    border: none;
    border-radius: 0;
  }
}
</style>
