module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'global-require': [1],
    'react/prop-types': [0]
  },
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true
    }
  }
};
