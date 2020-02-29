<template lang="html">
  <h1>Coming Soon!</h1>
</template>

<script>
export default {
  head() {
    return {
      title: 'Account',
    };
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/_globals.scss';

$font-size: 50px;

h1 {
  margin: 25px $margin-side;
  font-family: $font-family;
  font-size: $font-size;
  color: $white;
  opacity: 0.9;

  @include mq($until: desktop) {
    margin: 25px $margin-side-small;
  }
}
</style>
