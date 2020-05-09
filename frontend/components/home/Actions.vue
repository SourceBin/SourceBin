<template lang="html">
  <div class="actions">
    <button
      :disabled="$store.state.bin.saved"
      @click="save"
    >
      Save
    </button>
    <!-- <button>Add file</button> -->
  </div>
</template>

<script>
import { save } from '@/assets/home/save.js';

export default {
  methods: {
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
  margin: 0 var(--margin-side);
  display: flex;
  justify-content: flex-end;
}

button {
  margin-right: 15px;
  padding: 10px 25px;
  border: none;
  font-family: var(--font-family);
  font-size: var(--font-size-big);
  color: var(--text-900);
  background-color: var(--background-panel);
  border-radius: $border-radius;
  cursor: pointer;

  &:focus {
    outline-color: $red;
  }

  &:hover {
    background-color: var(--background-light);
  }

  &:last-child {
    margin-right: 0;
  }

  &:disabled {
    cursor: not-allowed;
  }
}
</style>
