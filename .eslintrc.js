module.exports = {
  "extends": [
    "taro/react",
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  "rules": {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "quotes": ["error", "single"],
    'semi': [
      'error',
      'never'
    ],
    'object-curly-spacing': ['error', 'always'],
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off'
  }
}
