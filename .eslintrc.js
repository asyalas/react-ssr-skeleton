module.exports = {
  "extends": "fbjs/strict",
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
  },
  "globals": {
    "document": true,
    "BMap":true,
    "System":true,
  },
  "rules": {
    "semi": 2,
    "indent": [2, 2, { "SwitchCase": 1 }],
    "space-before-function-paren": 0,
    "max-len": [1, { "code": 120 }],
    "one-var": 0,
    "quotes": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    "radix": [2, "as-needed"],
    "prefer-const": [2, {
      "destructuring": "any",
      "ignoreReadBeforeAssign": true
    }]
  }
};
