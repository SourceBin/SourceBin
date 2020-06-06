<template lang="html">
  <Overlay
    :visible="visible"
    @close="cancel"
  >
    <div class="confirm">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>

      <div class="buttons">
        <button
          @click="cancel"
          class="cancel"
        >
          Cancel
        </button>
        <button
          @click="confirm"
          class="confirm"
        >
          Confirm
        </button>
      </div>
    </div>
  </Overlay>
</template>

<script>
import Overlay from './Overlay.vue';

export default {
  components: {
    Overlay,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    cancel() {
      this.visible = false;
      this.$emit('cancel');
    },
    confirm() {
      this.visible = false;
      this.$emit('confirm');
    },
    open() {
      this.visible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.confirm {
  border-radius: 5px;
  padding: var(--margin-side);
  width: 100%;
  max-width: 500px;
  background-color: var(--background-primary);

  h1 {
    text-transform: uppercase;
    margin: 0 0 var(--margin-between);
    font-size: var(--font-size-large);
    color: var(--text-900);
    user-select: none;
    cursor: default;
  }

  p {
    margin: 0 0 var(--margin-between);
    font-size: var(--font-size-big);
    color: var(--text-800);
  }

  .buttons {
    display: flex;
    justify-content: flex-end;

    button {
      width: auto;
      background-color: inherit;
      border-radius: 3px;
      border: none;
      outline: none;
      font-size: var(--font-size-big);
      color: var(--text-700);
      padding: 10px 15px;
      cursor: pointer;

      &.cancel:hover {
        text-decoration: underline;
      }

      &.confirm {
        background-color: $red;
        color: $white-800;

        &:hover {
          background-color: $red-modifier-hover;
        }
      }
    }
  }
}
</style>
