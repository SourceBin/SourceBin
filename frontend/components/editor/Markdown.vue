<template lang="html">
  <div class="markdown-body" />
</template>

<script>
import { render } from '@/assets/markdown/markdown.js';

export default {
  props: {
    markdown: {
      type: String,
      required: true,
    },
  },
  watch: {
    markdown() {
      this.render();
    },
  },
  mounted() {
    this.render();
  },
  methods: {
    async render() {
      this.$el.innerHTML = await render(this.markdown);
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/markdown/markdown.scss';
@import 'highlight.js/styles/atom-one-dark.css';

$hljs-theme-background: #282c34;

.markdown-body {
  padding: calc(var(--margin-side) * 1.5);
}

.markdown-body pre,
.markdown-body .highlight pre {
  background-color: $hljs-theme-background;
}
</style>
