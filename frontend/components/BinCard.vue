<template lang="html">
  <div class="bin-card">
    <nuxt-link :to="`/${bin.key}`">
      {{ bin.key }}
    </nuxt-link>

    <div class="about">
      <p>
        <span
          :style="{ backgroundColor: `#${language.color || 'fff'}` }"
          class="language-color"
        />{{ language.name }}
      </p>

      <p>
        <font-awesome-icon :icon="['fas', 'calendar-day']" />
        {{ createdDate }}
      </p>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/assets/utils/date.js';
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
    createdDate() {
      return formatDate(new Date(this.bin.created));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.bin-card {
  padding: 15px var(--margin-side);
  font-family: var(--font-family);
  border-bottom: 1px solid var(--background-dark);

  &:last-child {
    border-bottom: none;
  }

  a {
    font-size: var(--font-size-big);
    font-weight: 500;
    color: $blue;
    text-decoration: none;
  }

  .about {
    display: flex;
    margin-top: 15px;
  }

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
</style>
