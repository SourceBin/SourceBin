<template>
  <div class="default-layout">
    <Header />
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Header,
    Footer,
  },
  watch: {
    '$store.state.settings.font': {
      immediate: true,
      handler(font) {
        if (process.client) {
          document.documentElement.style.setProperty('--editor-font-family', [font, 'monospace']);
        }
      },
    },
  },
};
</script>

<style lang="scss">
@import 'normalize.css';
@import '@/assets/styles/toasted.scss';
@import '@/assets/styles/_variables.scss';
@import '@/assets/styles/_scrollbar.scss';

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#__nuxt,
#__layout {
  height: 100%;
}

.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background-color: var(--background-primary);
}

@include scrollbar(var(--background-secondary), var(--background-primary));
</style>
