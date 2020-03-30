module.exports = {
  extends: '@syntek/syntek/typescript',
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'import/prefer-default-export': 'off',
  },
};
