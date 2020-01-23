<template lang="html">
  <div
    v-show="visible"
    @click.self="close"
    class="container"
  >
    <div class="selector">
      <div class="header">
        <h1>{{ title }}</h1>

        <input
          ref="search"
          v-model="searchQuery"

          placeholder="Search"
          type="text"
        >

        <a @click="close">X</a>
      </div>

      <ul ref="options">
        <li
          v-for="(option, index) in options"
          v-if="matchesSearch(option)"

          :key="index"
          @click="select(option)"
        >
          {{ option.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Mousetrap from 'mousetrap';
import { debounce } from 'lodash-es';

export default {
  props: {
    visible: Boolean,
    title: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      search: '',
      selectedIndex: 0,
      selectedElement: null,
    };
  },
  computed: {
    searchQuery: {
      get() {
        return this.search;
      },
      set: debounce(function (value) {
        this.search = value;
      }, 100),
    },
  },
  watch: {
    search: {
      handler() {
        this.selectedIndex = 0;
        this.updateSelected();
      },
      immediate: true,
    },
    selectedIndex() {
      this.updateSelected();
    },
  },
  mounted() {
    // Keybinds
    const mousetrap = new Mousetrap(this.$el);

    mousetrap.bind('esc', this.close);

    mousetrap.bind('up', () => {
      if (this.selectedIndex > 0) {
        this.selectedIndex -= 1;
      }

      return false;
    });

    mousetrap.bind('down', () => {
      if (this.selectedIndex < this.$refs.options.children.length - 1) {
        this.selectedIndex += 1;
      }

      return false;
    });

    mousetrap.bind('enter', () => {
      if (this.selectedElement) {
        this.selectedElement.click();
      }

      return false;
    });
  },
  methods: {
    matchesSearch(option) {
      const search = this.search.toLowerCase();
      const isMatch = value => value.toLowerCase().includes(search);

      return isMatch(option.name) || (option.aliases || []).some(isMatch);
    },
    updateSelected() {
      if (this.selectedElement) {
        this.selectedElement.classList.remove('selected');
      }

      this.$nextTick(() => {
        this.selectedElement = this.$refs.options.children[this.selectedIndex];

        if (this.selectedElement) {
          this.selectedElement.classList.add('selected');
          this.selectedElement.scrollIntoView({ block: 'center' });
        }
      });
    },

    show() {
      this.search = '';
      this.visible = true;

      this.$nextTick(() => this.$refs.search.focus());
    },
    hide() {
      this.visible = false;
    },

    close() {
      this.$emit('close');
    },
    select(option) {
      this.$emit('select', option.data);
    },

    promptSelect() {
      // Close the selector to reject the promise of other prompts
      this.close();

      return new Promise((resolve) => {
        this.show();

        this.$on('select', (option) => {
          this.hide();
          resolve(option);
        });

        this.$on('close', () => {
          this.hide();
          resolve();
        });
      });
    },

    remove() {
      this.$destroy();
      this.$el.remove();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/selector/_variables.scss';

.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: $container-z-index;
  display: flex;
  justify-content: center;
  align-items: center;
  background: $container-background;
}

.selector {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  height: 100%;
  background: $selector-background;
  color: $color;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 25px 100px;
}

h1 {
  margin: 0;
  font: $title-font;
  cursor: default;
  user-select: none;
}

input {
  padding: 8px 2px 2px;
  width: 250px;
  background: transparent;
  color: $color;
  outline: none;
  border: none;
  border-bottom: $input-border;
  font-family: $font-family;
}

a {
  position: absolute;
  top: 0;
  right: 0;
  margin: 15px;
  cursor: pointer;
  user-select: none;
  font: $close-font;
}

ul {
  margin: 0;
  padding: 0;
  height: 100%;
  list-style: none;
  overflow-y: scroll;
}

li {
  font: $option-font;
  padding: 10px 20px;
  cursor: pointer;
  user-select: none;
  border-top: $option-border;

  &:last-child {
    border-bottom: $option-border;
  }

  &.selected {
    background: $option-selected-background;
  }

  &:hover {
    background: $option-hover-background;
  }
}
</style>
