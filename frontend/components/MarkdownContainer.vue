<template lang="html">
  <div class="markdown-body">
    <slot />
  </div>
</template>

<style lang="scss">
@import '@/assets/markdown/markdown.scss';
@import 'highlight.js/styles/atom-one-dark.css';

$hljs-theme-background: #282c34;

.markdown-body pre,
.markdown-body .highlight pre {
  background-color: $hljs-theme-background;
}
</style>
