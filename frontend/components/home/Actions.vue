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
@import 'sass-mq';
@import '@/assets/_globals.scss';

$font-size: 17px;
$font-size-small: 15px;
$border-radius: 3px;

.actions {
  margin: 0 $margin-side;
  display: flex;
  justify-content: flex-end;

  @include mq($until: desktop) {
    margin: 0 $margin-side-small;
  }
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

  @include mq($until: tablet) {
    font-size: $font-size-small;
  }

  &:focus {
    outline-color: $red;
  }

  &:hover {
    background-color: $light-gray;
  }

  &:last-child {
    margin-right: 0;
  }

  &:disabled {
    cursor: not-allowed;
  }
}
</style>
