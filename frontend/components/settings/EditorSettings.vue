<template lang="html">
  <div class="editor-settings">
    <div class="options">
      <dl>
        <dt>Font family</dt>
        <dd>
          <input
            :value="font"
            @click="promptFontSelect($store)"
            type="button"
          >
        </dd>
      </dl>

      <dl>
        <dt>Font size</dt>
        <dd>
          <input
            v-model="fontSize"
            type="number"
            min="5"
            max="50"
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
        <dt>Language detection</dt>
        <dd>
          <input
            v-model="languageDetection"
            type="checkbox"
          >
        </dd>
      </dl>

      <dl>
        <dt>Default language</dt>
        <dd>
          <input
            :value="defaultLanguage"
            @click="promptDefaultLanguageSelect($store)"
            :disabled="languageDetection"
            type="button"
          >
        </dd>
      </dl>
    </div>

    <client-only>
      <AceEditor
        :theme="settings.theme"
        :options="editorOptions"
        value="function reverse(string) {
  let reversed = '';

  for (let i = string.length - 1; i >= 0; i--) {
    reversed += string[i];
  }

  return reversed;
}
"
        language="javascript"
      />
    </client-only>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { getLanguageById, promptDefaultLanguageSelect } from '@/assets/language.js';
import { getThemeName, promptThemeSelect } from '@/assets/theme.js';
import { promptFontSelect } from '@/assets/font.js';

export default {
  components: {
    AceEditor: () => import('@/components/editor/AceEditor.vue'),
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
      return getThemeName(this.settings.theme);
    },
    font() {
      return this.settings.font;
    },

    languageDetection: {
      get() {
        return this.settings.languageDetection;
      },
      set(languageDetection) {
        this.$store.commit('settings/setLanguageDetection', languageDetection);
      },
    },
    defaultLanguage() {
      return getLanguageById(this.settings.defaultLanguageId).name;
    },

    editorOptions() {
      return {
        fontSize: this.settings.fontSize,
        printMargin: this.settings.printMargin,

        fontFamily: 'var(--editor-font-family)',
        useWorker: false,
        readOnly: true,
        maxLines: 10,
      };
    },

    ...mapState(['settings']),
  },
  methods: {
    promptDefaultLanguageSelect,
    promptThemeSelect,
    promptFontSelect,
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 50px;
  margin: 0 auto;
  width: 600px;

  @include mq($until: tablet) {
    grid-template-columns: 1fr;
    margin: 0 var(--margin-side);
    width: auto;
  }

  dl {
    margin: 20px 0;

    dt {
      margin-bottom: 5px;
      font-size: var(--font-size-big);
      color: var(--text-800);
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
}
</style>
