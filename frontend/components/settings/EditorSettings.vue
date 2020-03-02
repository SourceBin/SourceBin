<template lang="html">
  <div class="editor-settings">
    <dl>
      <dt>Font size</dt>
      <dd>
        <input
          v-model="fontSize"
          type="number"
        >
      </dd>
    </dl>

    <dl>
      <dt>Print margin</dt>
      <dd>
        <input
          v-model="printMargin"
          type="checkbox"
        >
      </dd>
    </dl>

    <dl>
      <dt>Theme</dt>
      <dd>
        <input
          :value="theme"
          @click="promptThemeSelect($store)"
          type="button"
        >
      </dd>
    </dl>

    <dl>
      <dt>Default language</dt>
      <dd>
        <input
          :value="defaultLanguage"
          @click="promptLanguageSelect($store, true)"
          type="button"
        >
      </dd>
    </dl>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { getThemeName, promptThemeSelect } from '@/assets/theme.js';
import { getLanguageById, promptLanguageSelect } from '@/assets/language.js';

export default {
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
      return getThemeName(this.settings.theme);
    },
    defaultLanguage() {
      return getLanguageById(this.settings.defaultLanguageId).name;
    },
    ...mapState(['settings']),
  },
  methods: {
    promptLanguageSelect,
    promptThemeSelect,
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';
@import '@/assets/_globals.scss';

$font-size: 17px;

.editor-settings {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 50px;

  @include mq($until: tablet) {
    grid-template-columns: 1fr;
  }
}

dl {
  margin: 20px 0;

  dt {
    margin-bottom: 5px;
    font-size: $font-size;
    color: rgba($white, 0.8);
    font-weight: 500;
  }

  dd {
    margin-left: 0;
  }
}

input[type='number'] {
  width: 50px;
}

input[type='checkbox'] {
  margin-top: 2px;
  margin-left: 4px;
  transform: scale(1.5);
  cursor: pointer;
}

input[type='button'] {
  cursor: pointer;
}
</style>
