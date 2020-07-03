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
  async mounted() {
    // Try to load the user if they're not logged in. This is a potential fix of
    // the user not being loaded when they visit the site, which seems to be caused
    // by nuxtServerInit only running server-side.
    if (!this.$store.state.auth.loggedIn) {
      try {
        await this.$store.dispatch('auth/loadUser');
      } catch {} // eslint-disable-line no-empty
    }
  },
};
</script>

<style lang="scss">
@import 'normalize.css';
@import '@/assets/styles/toasted.scss';
@import '@/assets/styles/cssvars.scss';
@import '@/assets/styles/scrollbar.scss';
@import '@/assets/styles/_variables.scss';

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
