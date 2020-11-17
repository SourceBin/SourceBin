<template lang="html">
  <div class="actions">
    <button
      v-if="$store.getters.pro"
      :disabled="$store.state.bin.files.length >= 25"
      @click="addFile"
    >
      Add file
    </button>

    <button
      :disabled="$store.state.bin.saved"
      @click="save"
    >
      Save
    </button>
  </div>
</template>

<script>
import { save } from '@/assets/home/save.js';

export default {
  methods: {
    addFile() {
      this.$store.commit('bin/addFile');
    },
    save() {
      save(this);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

$border-radius: 3px;

.actions {
  margin: 0 var(--margin-side) var(--margin-between);
  display: flex;
  justify-content: flex-end;
}

button {
  margin-right: var(--margin-between);
  padding: 10px 25px;
  border: none;
  font-family: var(--font-family);
  font-size: var(--font-size-big);
  color: var(--text-900);
  background-color: var(--background-secondary);
  border-radius: $border-radius;
  cursor: pointer;

  &:focus {
    outline-color: $red;
  }

  &:hover {
    background-color: var(--background-modifier-hover);
  }

  &:last-child {
    margin-right: 0;
  }

  &:disabled {
    cursor: not-allowed;
  }
}
</style>
