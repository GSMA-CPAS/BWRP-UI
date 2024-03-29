module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', 'google'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'indent': 'off',
    'operator-linebreak': 'off',
    'no-console': 'off',
    'require-jsdoc': 'off',
    'comma-dangle': 'off',
    'max-len': [
      'warn',
      {
        code: 240,
      },
    ],
    "vue/no-mutating-props": "off"
  },
};
