<template lang="html">
  <Overlay
    :visible="visible"
    @close="close"
  >
    <div class="content">
      <div class="header">
        <h1>{{ title }}</h1>

        <input
          ref="search"
          :value="searchQuery"
          @input="searchQuery = $event.target.value"

          placeholder="Search"
          type="text"
        >

        <a @click="close"><CloseIcon /></a>
      </div>

      <ul
        ref="options"
        v-if="visible"
      >
        <li
          v-for="(option, index) in searchResults"

          :key="index"
          @click="select(option)"
        >
          {{ option.name }}
        </li>
      </ul>
    </div>
  </Overlay>
</template>

<script>
import Fuse from 'fuse.js';
import Mousetrap from 'mousetrap';
import { debounce } from 'lodash-es';

import CloseIcon from 'mdi-vue/Close.vue';
import { eventBus } from '@/assets/eventBus.js';
import Overlay from './Overlay.vue';

export default {
  components: {
    CloseIcon,
    Overlay,
  },
  props: {
    eventName: {
      type: String,
      required: true,
    },
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
      visible: false,
      selectedIndex: 0,
      selectedElement: undefined,
      fuse: this.buildFuse(),
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
    searchResults() {
      const results = this.fuse.search(this.search);

      return results.length > 0 ? results : this.options;
    },
  },
  watch: {
    search() {
      this.selectedIndex = 0;
      this.updateSelected();
    },
    selectedIndex() {
      this.updateSelected();
    },
  },
  mounted() {
    // Keybinds
    const mousetrap = new Mousetrap(this.$el);

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

    // Event bus
    eventBus.$on(this.eventName, async (callback) => {
      callback(await this.promptSelect());
    });
  },
  beforeDestroy() {
    eventBus.$off(this.eventName);
  },
  methods: {
    buildFuse() {
      return new Fuse(this.options, {
        keys: [
          { name: 'name', weight: 0.7 },
          { name: 'aliases', weight: 0.3 },
        ],
        shouldSort: true,
        threshold: 0.5,
      });
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

      this.selectedIndex = 0;
      this.updateSelected();

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

        this.$once('select', (option) => {
          this.hide();
          resolve(option);
        });

        this.$once('close', () => {
          this.hide();
          resolve();
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'sass-mq';

$font-size-close: 20px;

$input-border: 1px solid var(--text-700);
$option-border: 1px solid var(--background-modifier-accent);

.content {
  position: relative;
  display: flex;
  flex-direction: column;
  font-family: var(--font-family);
  width: 100%;
  max-width: 1000px;
  height: 100%;
  background: var(--background-primary);
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 25px 100px;
  color: var(--text-900);

  @include mq($until: tablet) {
    flex-direction: column;
    align-items: center;
    padding: 30px 10px;
  }
}

h1 {
  margin: 0;
  font-size: var(--font-size-header);
  font-weight: 500;
  cursor: default;
  user-select: none;
}

input {
  padding: 8px 2px 2px;
  width: 250px;
  background: transparent;
  color: var(--text-800);
  outline: none;
  border: none;
  border-bottom: $input-border;
}

a {
  position: absolute;
  top: 0;
  right: 0;
  margin: 15px;
  cursor: pointer;
  user-select: none;
  font-size: $font-size-close;
}

ul {
  margin: 0;
  padding: 0;
  height: 100%;
  list-style: none;
  overflow-y: auto;
  color: var(--text-800);
}

li {
  font-size: var(--font-size-big);
  padding: 10px 20px;
  cursor: pointer;
  user-select: none;
  border-top: $option-border;

  &:last-child {
    border-bottom: $option-border;
  }

  &.selected {
    background: var(--background-tertiary);
  }
}
</style>
