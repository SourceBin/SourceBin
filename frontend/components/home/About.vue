<template lang="html">
  <div class="about">
    <div
      @click="editTitle = true"
      :class="['title', title ? '' : 'placeholder']"
    >
      <InlineEditable
        v-model="title"
        :editable.sync="editTitle"
        :props="{ placeholder: 'Title', maxlength: 100 }"
      >
        <h1>{{ title || 'Title' }}</h1>
      </InlineEditable>
    </div>

    <div
      @click="editDescription = true"
      :class="['description', description ? '' : 'placeholder']"
    >
      <InlineEditable
        v-model="description"
        :editable.sync="editDescription"
        :props="{ placeholder: 'Description', maxlength: 1000 }"
      >
        <p>{{ description || 'Description' }}</p>
      </InlineEditable>
    </div>

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

$border-radius: 3px;

.about {
  flex: 1;
  margin: 0;
  padding: 20px var(--margin-side);
  background-color: var(--background-secondary);
  font-family: var(--font-family);
  border-radius: $border-radius;

  @include mq($until: desktop) {
    width: 100%;
  }

  @include mq($until: tablet) {
    padding: 10px var(--margin-side);
    border-radius: 0;
  }

  .title,
  .title h1 {
    margin: 0 0 10px;
    font-size: var(--font-size-large);
    font-weight: 500;
    color: var(--text-900);
  }

  .description,
  .description p {
    margin: 0 0 10px;
    font-size: var(--font-size-big);
    color: var(--text-800);
  }

  .stats {
    margin: 0;
    font-size: var(--font-size-regular);
    color: var(--text-700);
  }

  .placeholder h1,
  .placeholder p {
    font-style: italic;
    color: var(--text-600) !important;
  }
}
</style>
