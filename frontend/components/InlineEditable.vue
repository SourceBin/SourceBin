<template lang="html">
  <div class="inline-editable">
    <input
      ref="input"
      v-if="editable"

      @blur="save"
      @keyup.enter.prevent="save"
      @keyup.esc.prevent="cancel"

      v-model="buffer"
      v-bind="props"

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
    props: {
      type: Object,
      default: () => ({}),
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
.inline-editable {
  word-break: break-word;
}

input {
  padding: 0;
  width: 100%;
  outline: none;
  border: none;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
  background-color: inherit;

  &::placeholder {
    color: var(--text-700);
  }
}
</style>
