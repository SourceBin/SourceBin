<template lang="html">
  <li
    @click="click"
    :class="{ disabled, 'no-select': noSelect }"
  >
    <slot />
  </li>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    noSelect: Boolean,
  },
  methods: {
    click(event) {
      if (this.disabled || this.noSelect) {
        return;
      }

      this.$emit('click', event);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/nav/_variables.scss';

li {
  float: left;
  display: block;
  padding: 0 15px;
  line-height: $height;
}

li:not(.no-select) {
  cursor: pointer;

  &:hover {
    background: $background-hover;
  }
}

li.disabled {
  cursor: not-allowed;

  &:hover {
    background: lighten($background-hover, 5%);
  }
}
</style>
