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
        Language - {{ $store.getters.language.name }}
      </NavItem>

      <NavItem @click="openSettings">
        Settings
      </NavItem>
    </Navbar>

    <Selector
      ref="languageSelector"
      :options="languageOptions"
      title="Language Selector"
    />

    <Settings ref="settings" />
  </header>
</template>

<script>
import Mousetrap from 'mousetrap';
import { linguist } from '@packages/linguist';

import clipboardCopy from 'clipboard-copy';

import Navbar from '@/components/nav/Navbar.vue';
import NavItem from '@/components/nav/NavItem.vue';
import Selector from '@/components/Selector.vue';
import Settings from '@/components/Settings.vue';

export default {
  components: {
    Navbar,
    NavItem,
    Selector,
    Settings,
  },
  data() {
    return {
      languageOptions: Object
        .entries(linguist)
        .map(([id, language]) => ({
          name: language.name,
          aliases: language.aliases,
          data: Number(id),
        })),
    };
  },
  mounted() {
    // Keybinds
    Mousetrap.bind('ctrl+s', (e) => {
      if (!e.repeat) {
        this.save();
      }

      return false;
    });

    Mousetrap.bind('ctrl+l', (e) => {
      if (!e.repeat) {
        this.selectLanguage();
      }

      return false;
    });
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
      const languageId = await this.$refs.languageSelector.promptSelect();

      if (languageId) {
        this.$store.commit('bin/setLanguageId', languageId);
      }

      return languageId;
    },
    openSettings() {
      this.$refs.settings.open();
    },
  },
};
</script>
