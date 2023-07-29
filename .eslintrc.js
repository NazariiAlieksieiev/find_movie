module.exports = {
  extends: ['@mate-academy/eslint-config-react-typescript'],
  rules: {
    'max-len': [
      'error',
      {
        ignoreTemplateLiterals: true,
        ignoreComments: true,
        code: 80,
      },
    ],
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        assert: 'either',
      },
    ],
    'react/no-array-index-key': 'off',
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
