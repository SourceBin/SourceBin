<template lang="html">
  <div class="about">
    <h1
      @click="editTitle = true"
      :class="['title', title ? '' : 'placeholder']"
    >
      <InlineEditable
        v-model="title"
        :editable.sync="editTitle"
        placeholder="Title"
      >
        {{ title || 'Title' }}
      </InlineEditable>
    </h1>

    <p
      @click="editDescription = true"
      :class="['description', description ? '' : 'placeholder']"
    >
      <InlineEditable
        v-model="description"
        :editable.sync="editDescription"
        placeholder="Description"
      >
        {{ bin.description || 'Description' }}
      </InlineEditable>
    </p>

    <div class="stats">
      <div>
        <font-awesome-icon :icon="['fas', 'calendar-day']" />
        {{ bin.created | date }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import InlineEditable from '@/components/InlineEditable.vue';

export default {
  components: {
    InlineEditable,
  },
  data() {
    return {
      editTitle: false,
      editDescription: false,
    };
  },
  computed: {
    title: {
      get() {
        return this.bin.title || '';
      },
      set(title) {
        this.$store.commit('bin/setTitle', title);
      },
    },
    description: {
      get() {
        return this.bin.description || '';
      },
      set(description) {
        this.$store.commit('bin/setDescription', description);
      },
    },
    ...mapState(['bin']),
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';

.about {
  margin: 0 0 15px;
  padding: 20px var(--margin-side);
  background-color: var(--background-secondary);
  font-family: var(--font-family);

  @include mq($until: tablet) {
    padding: 10px var(--margin-side);
  }

  .title {
    margin: 0 0 10px;
    font-size: var(--font-size-large);
    font-weight: 500;
    color: var(--text-900);
  }

  .description {
    margin: 0 0 10px;
    word-wrap: break-word;
    font-size: var(--font-size-big);
    color: var(--text-800);
  }

  .stats {
    margin: 0;
    font-size: var(--font-size-regular);
    color: var(--text-700);
  }

  .placeholder {
    font-style: italic;
    color: var(--text-700) !important;
  }
}
</style>
