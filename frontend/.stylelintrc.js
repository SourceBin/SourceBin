module.exports = {
  processors: [
    ['@mapbox/stylelint-processor-arbitrary-tags', { fileFilterRegex: [/\.vue$/] }],
  ],
  extends: 'stylelint-config-strict-scss',
  rules: {
    'no-empty-source': null,
    'selector-max-compound-selectors': null,

    'scss/at-import-partial-extension-blacklist': null,
    'scss/at-import-no-partial-leading-underscore': null,
    'scss/at-function-named-arguments': null,
    'scss/at-mixin-named-arguments': null,
    'max-nesting-depth': 5,

    'color-format/format': null,
  },
};
