<template lang="html">
  <div />
</template>

<script>
let ace;

if (process.browser) {
  /* eslint-disable global-require */
  ace = require('ace-builds');
  require('ace-builds/webpack-resolver');
  /* eslint-enable global-require */
}

export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    value(value) {
      if (value !== this.editor.getValue()) {
        this.setValue(value);
      }
    },
    language(language) {
      this.setLanguage(language);
    },
    theme(theme) {
      this.setTheme(theme);
    },
    options(options) {
      this.setOptions(options);
    },
  },
  async mounted() {
    this.editor = ace.edit(this.$el, this.options);

    // Settings
    this.setValue(this.value);

    await Promise.all([
      this.setLanguage(this.language),
      this.setTheme(this.theme),
    ]);

    // Commands
    this.editor.commands.removeCommand('gotoline');

    // Listeners
    this.editor.on('change', () => {
      this.$emit('input', this.editor.getValue());
    });

    // Emit ready event
    this.$emit('ready');
  },
  beforeDestroy() {
    this.editor.destroy();
    this.editor.container.remove();
  },
  methods: {
    setValue(value) {
      this.editor.setValue(value, -1);
    },
    async setLanguage(mode) {
      await import(`ace-builds/src-noconflict/mode-${mode}`);

      this.editor.session.setMode(`ace/mode/${mode}`);
    },
    async setTheme(theme) {
      await import(`ace-builds/src-noconflict/theme-${theme}`);

      this.editor.setTheme(`ace/theme/${theme}`);
    },
    setOptions(options) {
      this.editor.setOptions(options);
    },
    focus() {
      this.editor.focus();
    },
  },
};
</script>
