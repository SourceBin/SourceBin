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
            @click="promptDefaultLanguageSelect($store)"
            type="button"
          >
        </dd>
      </dl>

      <dl>
        <dt>Prompt language select on save</dt>
        <dd>
          <input
            v-model="promptLanguageSelectOnSave"
            type="checkbox"
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
import { promptFontSelect } from '@/assets/fonts/fonts.js';

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

    defaultLanguage() {
      return getLanguageById(this.settings.defaultLanguageId).name;
    },
    promptLanguageSelectOnSave: {
      get() {
        return this.settings.promptLanguageSelectOnSave;
      },
      set(promptLanguageSelectOnSave) {
        this.$store.commit('settings/promptLanguageSelectOnSave', promptLanguageSelectOnSave);
      },
    },

    editorOptions() {
      return {
        fontSize: this.settings.fontSize,
        showPrintMargin: this.settings.printMargin,
        fontFamily: this.settings.font,

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
@import '@/assets/_globals.scss';

$font-size: 17px;

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 0 50px;
  margin: 0 auto;
  width: 600px;

  @include mq($until: tablet) {
    grid-template-columns: 1fr;
    margin: 0 $margin-side-small;
    width: auto;
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
}
</style>
