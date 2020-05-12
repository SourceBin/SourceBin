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
@import 'sass-mq';
@import 'github-markdown-css';
@import 'highlight.js/styles/atom-one-dark.css';
@import '@/assets/styles/_variables.scss';

$hljs-theme-background: #282c34;

.markdown-body {
  background-color: $white-800;
  padding: 45px;

  @include mq($until: tablet) {
    padding: 15px;
  }
}

.markdown-body pre,
.markdown-body .highlight pre {
  background-color: $hljs-theme-background;
}
</style>
