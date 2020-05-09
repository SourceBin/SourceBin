<template lang="html">
  <div class="bin-card">
    <nuxt-link :to="`/${bin.key}`">
      {{ bin.key }}
    </nuxt-link>

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
@import '@/assets/styles/_variables.scss';

.bin-card {
  padding: 10px 15px;
  display: inline-block;
  max-width: 400px;
  font-family: var(--font-family);
  border: 1px solid var(--background-light);
  border-radius: 3px;

  a {
    font-size: var(--font-size-big);
    font-weight: 500;
    color: $blue;
    text-decoration: none;
  }

  p {
    margin: 15px 0 0;
    color: var(--text-700);

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
