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
export default {
  props: {
    visible: Boolean,
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_globals.scss';

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
  background: rgba($white, 0.1);
}
</style>
