<template lang="html">
  <div
    v-show="visible"
    @click.self="$emit('close')"
    class="overlay"
  >
    <slot />
  </div>
</template>

<script>
import Mousetrap from 'mousetrap';

export default {
  props: {
    visible: Boolean,
  },
  mounted() {
    const mousetrap = new Mousetrap(this.$el);

    mousetrap.bind('esc', () => this.$emit('close'));
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

$z-index: 100000;

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: $z-index;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba($black-900, 0.5);
  backdrop-filter: blur(1px);
}
</style>
