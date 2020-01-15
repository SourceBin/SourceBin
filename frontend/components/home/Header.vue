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
        Language
      </NavItem>

      <NavItem>Theme</NavItem>
      <NavItem>Settings</NavItem>
    </Navbar>
  </header>
</template>

<script>
import { linguist } from 'linguist';

import Navbar from '@/components/nav/Navbar.vue';
import NavItem from '@/components/nav/NavItem.vue';

export default {
  components: {
    Navbar,
    NavItem,
  },
  mounted() {
    this.languageSelector = this.$createSelector({
      title: 'Language Selector',
      options: Object
        .entries(linguist)
        .map(([id, language]) => ({
          name: language.name,
          aliases: language.aliases,
          data: id,
        })),
    });
  },
  beforeDestroy() {
    this.languageSelector.remove();
  },
  methods: {
    save() {
      this.$store.dispatch('bin/save');
    },
    reset() {
      this.$store.commit('bin/reset');
    },
    async selectLanguage() {
      const languageId = await this.languageSelector.promptSelect();

      if (languageId) {
        this.$store.commit('bin/setLanguage', languageId);
      }
    },
  },
};
</script>
