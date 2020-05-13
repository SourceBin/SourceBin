<template lang="html">
  <div class="editable">
    <input
      ref="input"
      v-if="editable"

      @blur="save"
      @keyup.enter.prevent="save"
      @keyup.esc.prevent="cancel"

      v-model="buffer"
      :placeholder="placeholder"

      type="text"
      spellcheck="false"
      autocapitalize="off"
      autocorrect="off"
    >

    <slot v-else />
  </div>
</template>

<script>
export default {
  props: {
    editable: Boolean,
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      buffer: this.value,
    };
  },
  watch: {
    editable(editable) {
      if (!editable) {
        return;
      }

      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
  },
  methods: {
    save() {
      this.$emit('input', this.buffer);
      this.$emit('update:editable', false);
    },
    cancel() {
      this.buffer = this.value;
      this.$emit('update:editable', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.editable input {
  padding: 0;
  width: 150px;
  outline: none;
  border: none;
  color: inherit;
  background-color: inherit;
}
</style>
