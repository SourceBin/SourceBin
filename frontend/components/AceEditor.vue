<template lang="html">
  <div />
</template>

<script>
const ace = process.browser
  ? require('brace')
  : undefined;

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
  },
  async mounted() {
    this.editor = ace.edit(this.$el);

    // Automatically scrolling cursor into view after selection change this will
    // be disabled in the next version set editor.$blockScrolling = Infinity to
    // disable this message
    this.editor.$blockScrolling = Infinity;

    // Settings
    this.setValue(this.value);

    await Promise.all([
      this.setLanguage(this.language),
      this.setTheme(this.theme),
    ]);

    this.editor.setOptions(this.options);

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
      await import(`brace/mode/${mode}`);

      this.editor.session.setMode(`ace/mode/${mode}`);
    },
    async setTheme(theme) {
      await import(`brace/theme/${theme}`);

      this.editor.setTheme(`ace/theme/${theme}`);
    },
  },
};
</script>
