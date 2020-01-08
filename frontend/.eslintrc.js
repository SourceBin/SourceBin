module.exports = {
  extends: [
    '@syntek/syntek/vue',
    'plugin:nuxt/recommended',
  ],
  // add your custom rules here
  rules: {
    'import/prefer-default-export': 'off',

    // Disable this rule so import aliases work
    'import/no-unresolved': 'off',
  }
}
