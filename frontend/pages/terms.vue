<template lang="html">
  <MarkdownContainer v-html="terms" />
</template>

<script>
import MarkdownContainer from '@/components/MarkdownContainer.vue';

import terms from '@/assets/legal/terms.md';

export default {
  components: {
    MarkdownContainer,
  },
  data() {
    return {
      terms,
    };
  },
};
</script>

<style lang="scss" scoped>
.markdown-body {
  margin: 0 auto;
  padding: calc(var(--margin-side) * 3) var(--margin-side);
  width: 100%;
  max-width: 900px;
}
</style>
