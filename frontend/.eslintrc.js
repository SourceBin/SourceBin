module.exports = {
  parserOptions: {
    ecmaVersion: 11,
  },

  extends: [
    '@syntek/syntek/vue',
    'plugin:nuxt/recommended',
  ],

  settings: {
    'import/resolver': {
      alias: [
        ['@', '.']
      ],
    },
  },

  rules: {
    'import/prefer-default-export': 'off',
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
