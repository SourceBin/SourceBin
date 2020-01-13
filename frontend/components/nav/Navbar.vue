<template lang="html">
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

nav {
  display: flex;
  justify-content: space-between;
  background: $background;
  color: $color;
  font: $font;
  user-select: none;
  cursor: default;
}

ul {
  margin: 0;
  padding: 0;
  min-height: $height;
  list-style: none;
}
</style>
