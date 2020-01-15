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
import { linguist } from 'linguist';
import themes from 'themes';

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
  },
  beforeDestroy() {
    this.languageSelector.remove();
  },
  methods: {
    async save() {
      const languageId = await this.selectLanguage();

      if (languageId) {
        this.$store.dispatch('bin/save');
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
