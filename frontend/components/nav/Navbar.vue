<template lang="html">
  <header>
    <nav>
      <ul>
        <slot />
      </ul>

      <ul>
        <NavItem no-select>
          SourceBin
        </NavItem>
      </ul>
    </nav>
  </header>
</template>

<script>
import NavItem from './NavItem.vue';

export default {
  components: {
    NavItem,
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/nav/_variables.scss';
@import url('https://fonts.googleapis.com/css?family=Raleway');

header {
  background: $background;
  color: $color;
  font: $font;
  user-select: none;
  cursor: default;
}

nav {
  display: flex;
  justify-content: space-between;
}

ul {
  margin: 0;
  padding: 0;
  min-height: $height;
  list-style: none;
}
</style>
