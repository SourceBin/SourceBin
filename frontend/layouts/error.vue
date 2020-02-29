<template lang="html">
  <div class="error">
    <img
      :src="`https://http.cat/${error.statusCode}`"
      :alt="error.statusCode"
    >

    <h1>{{ error.message }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/_globals.scss';

.error {
  margin: 25px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

img {
  width: 500px;

  @include mq($until: tablet) {
    width: 300px;
  }
}

h1 {
  font-family: $font-family;
  color: $white;
  opacity: 0.9;
  text-align: center;
}
</style>
