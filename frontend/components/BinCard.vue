<template lang="html">
  <div class="bin-card">
    <a :href="`/${bin.key}`">{{ bin.key }}</a>

    <p>{{ language.name }}</p>
  </div>
</template>

<script>
import { getLanguageById } from '@/assets/language.js';

export default {
  props: {
    bin: {
      type: Object,
      required: true,
    },
  },
  computed: {
    language() {
      return getLanguageById(this.bin.files[0].languageId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_globals.scss';

.bin-card {
  padding: 10px 15px;
  display: inline-block;
  min-width: 300px;
  font-family: $font-family;
  border: 1px solid rgba($white, 0.5);
  border-radius: 3px;

  a {
    font-size: 18px;
    font-weight: 500;
    color: rgba($blue, 0.9);
    text-decoration: none;
  }

  p {
    margin: 15px 0 0;
    color: rgba($white, 0.7);
  }
}
</style>
