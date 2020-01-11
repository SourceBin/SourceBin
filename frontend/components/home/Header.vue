<template lang="html">
  <header>
    <Navbar>
      <NavItem
        @click="$store.dispatch('bin/save')"
        :disabled="$store.state.bin.saved"
      >
        Save
      </NavItem>

      <NavItem @click="$store.commit('bin/reset')">
        New
      </NavItem>

      <NavItem>Language</NavItem>
      <NavItem>Theme</NavItem>
      <NavItem>Settings</NavItem>
    </Navbar>
  </header>
</template>

<script>
import Navbar from '@/components/nav/Navbar.vue';
import NavItem from '@/components/nav/NavItem.vue';

export default {
  components: {
    Navbar,
    NavItem,
  },
};
</script>
