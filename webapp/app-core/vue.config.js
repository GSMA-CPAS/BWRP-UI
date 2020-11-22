'use strict';

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
