module.exports = {
  root: true,
  extends: ['next', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
};
