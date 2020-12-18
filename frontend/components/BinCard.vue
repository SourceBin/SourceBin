<template lang="html">
  <div class="bin-card">
    <div class="about">
      <nuxt-link :to="`/${bin.key}`">
        {{ bin.key }} {{ bin.title ? `| ${bin.title}` : '' }}
      </nuxt-link>

      <p
        v-if="bin.description"
        class="description"
      >
        {{ bin.description }}
      </p>

      <div class="stats">
        <p>
          <font-awesome-icon :icon="['fas', 'calendar-day']" />
          {{ bin.created | date }}
        </p>

        <p>
          <font-awesome-icon :icon="['fas', 'eye']" />
          {{ bin.hits }} {{ 'view' | pluralize(bin.hits) }}
        </p>

        <p>
          <font-awesome-icon :icon="['fas', 'file-code']" />
          {{ bin.files.length }} {{ 'file' | pluralize(bin.files.length) }}
        </p>
      </div>

      <div class="languages">
        <ul>
          <li v-for="language in languages">
            <span
              :style="{ backgroundColor: `#${language.color || 'fff'}` }"
              class="language-color"
            />{{ language.name }}
          </li>
        </ul>
      </div>
    </div>

    <div class="delete">
      <font-awesome-icon
        :icon="['fas', 'trash']"
        @click="$refs.disownBin.open()"
      />

      <Confirm
        ref="disownBin"
        @confirm="$emit('disown')"
        title="Disown Bin"
      >
        <p>Are you sure you want to disown this bin? This cannot be undone.</p>

        <p>
          <strong>NOTE:</strong> The bin will stay valid, but it won't be associated
          with your account.
        </p>
      </Confirm>
    </div>
  </div>
</template>

<script>
import Confirm from '@/components/overlay/Confirm.vue';

import { getLanguageById } from '@/assets/language.js';

export default {
  components: {
    Confirm,
  },
  props: {
    bin: {
      type: Object,
      required: true,
    },
  },
  computed: {
    languages() {
      const ids = [...new Set(this.bin.files.map(file => file.languageId))];

      return ids.map(id => getLanguageById(id));
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.bin-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px var(--margin-side);
  font-family: var(--font-family);
  border-bottom: 1px solid var(--background-modifier-accent);

  &:last-child {
    border-bottom: none;
  }

  .about {
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

    .stats {
      display: flex;
      flex-wrap: wrap;

      p {
        margin: 10px 15px 0 0;
        font-size: var(--font-size-regular);
        color: var(--text-700);
      }

      svg {
        margin-right: 5px;
      }
    }

    .languages {
      ul {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      li {
        display: inline-flex;
        margin: 10px 15px 0 0;
        font-size: var(--font-size-regular);
        color: var(--text-700);
      }

      .language-color {
        margin-right: 5px;
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
    }
  }

  .delete {
    // stylelint-disable-next-line no-descending-specificity
    svg {
      color: $red;
      font-size: var(--font-size-big);
      cursor: pointer;
    }
  }
}
</style>
