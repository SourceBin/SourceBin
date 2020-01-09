module.exports = {
  extends: [
    '@syntek/syntek/vue',
    'plugin:nuxt/recommended',
  ],

  rules: {
    'import/prefer-default-export': 'off',

    // Disable this rule so import aliases work
    'import/no-unresolved': 'off',
  },

  overrides: [
    {
      files: ['store/*.js'],
      rules: {
        'no-shadow': 'off',
        'no-param-reassign': 'off',
      }
    },
    {
      files: ['*.vue'],
      rules: {
        'func-names': 'off',
      },
    },
  ]
}
