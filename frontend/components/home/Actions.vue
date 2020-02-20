<template lang="html">
  <div class="actions">
    <button @click="save($store)">
      Save
    </button>
    <!-- <button>Add file</button> -->
  </div>
</template>

<script>
import { save } from '@/assets/home/save.js';

export default {
  methods: {
    save,
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/_globals.scss';

$font-size: 17px;
$border-radius: 3px;

.actions {
  margin: 0 50px;
  display: flex;
  justify-content: flex-end;
}

button {
  margin-right: 15px;
  padding: 10px 25px;
  border: none;
  font-family: $font-family;
  font-size: $font-size;
  color: rgba($white, 0.8);
  background-color: $gray;
  border-radius: $border-radius;
  cursor: pointer;

  &:focus {
    outline-color: $red;
  }

  &:last-child {
    margin-right: 0;
  }
}
</style>
