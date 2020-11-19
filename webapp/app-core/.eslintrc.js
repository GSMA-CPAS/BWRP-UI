module.exports = {
  root: true,
  env: {
    node: true
  },
  "extends": [
    "plugin:vue/essential",
    "eslint:recommended",
    "google"
  ],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": "warn",
    "require-jsdoc": "off",
    "comma-dangle": "off",
    "max-len": [ "warn", {
      "code": 360
    }],
  }
}
