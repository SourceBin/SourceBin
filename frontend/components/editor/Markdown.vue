<template lang="html">
  <MarkdownContainer v-html="rendered" />
</template>

<script>
import MarkdownContainer from '@/components/MarkdownContainer.vue';

import { render } from '@/assets/markdown/markdown.js';

export default {
  components: {
    MarkdownContainer,
  },
  props: {
    markdown: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      rendered: '',
    };
  },
  watch: {
    markdown: {
      immediate: true,
      async handler() {
        this.rendered = await render(this.markdown);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.markdown-body {
  padding: calc(var(--margin-side) * 1.5);
  background-color: var(--background-primary);
}
</style>
