<template lang="html">
  <div
    v-show="visible"
    @click.self="close"
    class="container"
  >
    <div class="content">
      <h1>Settings</h1>

      <a @click="close">X</a>

      <div class="settings">
        <div>
          <p>Font size</p>
          <input
            v-model="fontSize"
            type="number"
          >
        </div>

        <div>
          <p>Print margin</p>
          <input
            v-model="printMargin"
            type="checkbox"
          >
        </div>

        <div>
          <p>Theme</p>
          <input
            :value="theme"
            @click="selectTheme"
            type="button"
          >
        </div>

        <div>
          <p>Default language</p>
          <input
            :value="defaultLanguage"
            @click="selectLanguage"
            type="button"
          >
        </div>
      </div>

      <Selector
        ref="themeSelector"
        :options="themeOptions"
        title="Theme Selector"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import themes from 'themes';
import { linguist } from 'linguist';

import Selector from '@/components/Selector.vue';

export default {
  components: {
    Selector,
  },
  data() {
    return {
      visible: false,
      themeOptions: Object
        .entries(themes)
        .map(([theme, name]) => ({
          name,
          data: theme,
        })),
    };
  },
  computed: {
    fontSize: {
      get() {
        return this.settings.fontSize;
      },
      set(fontSize) {
        this.$store.commit('settings/setFontSize', Number(fontSize));
      },
    },
    printMargin: {
      get() {
        return this.settings.printMargin;
      },
      set(printMargin) {
        this.$store.commit('settings/setPrintMargin', printMargin);
      },
    },
    theme() {
      return this.$store.getters.theme;
    },
    defaultLanguage() {
      return linguist[this.settings.defaultLanguageId].name;
    },
    ...mapState(['settings']),
  },
  methods: {
    async selectTheme() {
      const theme = await this.$refs.themeSelector.promptSelect();

      if (theme) {
        this.$store.commit('settings/setTheme', theme);
      }

      return theme;
    },
    async selectLanguage() {
      const languageId = await this.$parent.$refs.languageSelector.promptSelect();

      if (languageId) {
        this.$store.commit('settings/setDefaultLanguageId', languageId);
      }

      return languageId;
    },

    open() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_globals.scss';

$container-z-index: 10000;

$container-background: rgba(255, 255, 255, 0.1);
$content-background: #2c2f33;

$title-font: bold 30px $font-family;
$close-font: 20px Arial, sans-serif;
$setting-font: 18px $font-family;

.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: $container-z-index;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: $container-background;
}

.content {
  padding: 50px 100px;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  max-height: 100%;
  background: $content-background;
  color: $color;
}

h1 {
  margin: 0;
  font: $title-font;
  cursor: default;
  user-select: none;
}

a {
  position: absolute;
  top: 0;
  right: 0;
  margin: 15px;
  cursor: pointer;
  user-select: none;
  font: $close-font;
}

.settings {
  margin-top: 25px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 50px;

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font: $setting-font;
    user-select: none;
  }
}

input[type='number'] {
  width: 50px;
}

input[type='checkbox'] {
  transform: scale(1.5);
  cursor: pointer;
}

input[type='button'] {
  cursor: pointer;
}
</style>
