<template lang="html">
  <header>
    <Navbar>
      <NavItem
        @click="save"
        :disabled="$store.state.bin.saved"
      >
        Save
      </NavItem>

      <NavItem @click="reset">
        New
      </NavItem>

      <NavItem @click="selectLanguage">
        Language - {{ language }}
      </NavItem>

      <NavItem @click="selectTheme">
        Theme - {{ theme }}
      </NavItem>

      <NavItem>Settings</NavItem>
    </Navbar>
  </header>
</template>

<script>
import Mousetrap from 'mousetrap';
import { linguist } from 'linguist';
import themes from 'themes';

import clipboardCopy from 'clipboard-copy';

import Navbar from '@/components/nav/Navbar.vue';
import NavItem from '@/components/nav/NavItem.vue';

export default {
  components: {
    Navbar,
    NavItem,
  },
  computed: {
    language() {
      return linguist[this.$store.state.bin.languageId].name;
    },
    theme() {
      return themes[this.$store.state.settings.theme];
    },
  },
  mounted() {
    // Selectors
    this.languageSelector = this.$createSelector({
      title: 'Language Selector',
      options: Object
        .entries(linguist)
        .map(([id, language]) => ({
          name: language.name,
          aliases: language.aliases,
          data: Number(id),
        })),
    });

    this.themeSelector = this.$createSelector({
      title: 'Theme Selector',
      options: Object
        .entries(themes)
        .map(([theme, name]) => ({
          name,
          data: theme,
        })),
    });

    // Keybinds
    Mousetrap.bind('ctrl+s', (e) => {
      if (!e.repeat) {
        this.save();
      }

      return false;
    });
  },
  beforeDestroy() {
    this.languageSelector.remove();
  },
  methods: {
    async save() {
      const languageId = await this.selectLanguage();

      if (languageId) {
        await this.$store.dispatch('bin/save');

        // Update URL with key
        window.history.pushState(null, null, this.$store.state.bin.key);

        // Copy URL to clipboard
        await clipboardCopy(window.location.href);
      }
    },
    reset() {
      this.$store.commit('bin/reset');
    },
    async selectLanguage() {
      const languageId = await this.languageSelector.promptSelect();

      if (languageId) {
        this.$store.commit('bin/setLanguage', languageId);
      }

      return languageId;
    },
    async selectTheme() {
      const theme = await this.themeSelector.promptSelect();

      if (theme) {
        this.$store.commit('settings/setTheme', theme);
      }

      return theme;
    },
  },
};
</script>
