<template lang="html">
  <li>{{ name }}</li>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    favorite: Boolean,
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/selector/_variables.scss';

li {
  font: $option-font;
  padding: 10px 20px;
  cursor: pointer;
  user-select: none;
  border-top: $option-border;

  &:last-child {
    border-bottom: $option-border;
  }

  &:hover {
    background: $option-hover-background;
  }
}
</style>
