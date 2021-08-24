'use strict';

// set app version from package.json
process.env.VUE_APP_VERSION = process.env.npm_package_version || 0;

module.exports = {
  'transpileDependencies': [
    'vuetify',
  ],
  'chainWebpack': (config) => {
    config.performance.hints(false);
  },
  'css': {
    extract: {
      ignoreOrder: true,
    },
  },
  'devServer': {
    host: 'localhost',
    port: 9000,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
      },
      '/app': {
        target: 'http://localhost:3000',
      },
    },
  },
};
