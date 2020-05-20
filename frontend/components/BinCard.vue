<template lang="html">
  <div class="bin-card">
    <nuxt-link :to="`/${bin.key}`">
      {{ bin.key }} {{ bin.title ? `| ${bin.title}` : '' }}
    </nuxt-link>

    <p
      v-if="bin.description"
      class="description"
    >
      {{ bin.description }}
    </p>

    <div class="about">
      <p>
        <span
          :style="{ backgroundColor: `#${language.color || 'fff'}` }"
          class="language-color"
        />{{ language.name }}
      </p>

      <p>
        <font-awesome-icon :icon="['fas', 'calendar-day']" />
        {{ bin.created | date }}
      </p>
    </div>
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
  padding: 15px var(--margin-side);
  font-family: var(--font-family);
  border-bottom: 1px solid var(--background-modifier-accent);

  &:last-child {
    border-bottom: none;
  }

  a {
    font-size: var(--font-size-big);
    font-weight: 500;
    color: $blue;
    text-decoration: none;
  }

  .description {
    margin: 10px 0 0;
    font-size: var(--font-size-big);
    color: var(--text-700);
  }

  .about {
    display: flex;
    margin-top: 10px;

    p {
      margin: 0 15px 0 0;
      font-size: var(--font-size-regular);
      color: var(--text-700);

      svg,
      .language-color {
        margin-right: 5px;
      }

      .language-color {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
    }
  }
}
</style>
