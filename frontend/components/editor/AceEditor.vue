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
  data() {
    return {
      ignoreNextChange: false,
    };
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
      if (this.ignoreNextChange) {
        this.ignoreNextChange = false;
        return;
      }

      this.$emit('input', this.editor.getValue());
    });

    // Add mousetrap class to editor textarea to allow keybinds
    Array
      .from(this.$el.getElementsByTagName('textarea'))
      .forEach(el => el.classList.add('mousetrap'));

    // Emit ready event
    this.$emit('ready');
  },
  beforeDestroy() {
    this.editor.destroy();
    this.editor.container.remove();
  },
  methods: {
    setValue(value) {
      // Ace sometimes fires the change event twice when the value is changed
      // programmatically, and sometimes it doesn't fire it at all.
      //
      // On the first fire the getValue method returns an empty string, and on the
      // second fire it returns the new value, which causes issues with updating
      // the url.
      //
      // To work around this behaviour the next change event after changing the
      // value programmatically is ignored. The ignoreNextChange is set to false
      // afterwards to make sure it doesn't ignore the next change event when it
      // isn't fired this time.
      this.ignoreNextChange = true;
      this.editor.setValue(value, -1);
      this.ignoreNextChange = false;
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
