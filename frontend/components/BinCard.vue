<template lang="html">
  <div class="bin-card">
    <a :href="`/${bin.key}`">{{ bin.key }}</a>

    <p>
      <span
        :style="{ backgroundColor: `#${language.color || 'fff'}` }"
        class="language-color"
      />{{ language.name }}
    </p>
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

$name-font-size: 18px;

.bin-card {
  padding: 10px 15px;
  display: inline-block;
  max-width: 400px;
  font-family: $font-family;
  border: 1px solid rgba($white, 0.5);
  border-radius: 3px;

  a {
    font-size: $name-font-size;
    font-weight: 500;
    color: rgba($blue, 0.9);
    text-decoration: none;
  }

  p {
    margin: 15px 0 0;
    color: rgba($white, 0.7);

    .language-color {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
}
</style>
