const fs = require('fs');
const webpack = require('webpack');
const path = require('path');
const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;
const name = JSON.parse(packageJson).name || 'undefined';
function resolve(dir) {
  return path.resolve(__dirname, dir);
}

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: '"' + version + '"',
        },
      }),
    ],
    resolve: {
      /* add aliases here, also edit jsconfig for intellisense in VSCode */
      alias: {
        '@validation': resolve('./src/utils/validation'),
        '@mixins': resolve('./src/utils/mixins'),
        '@dialogs': resolve('./src/components/dialogs'),
        '@components': resolve('./src/components/other'),
        '@pages': resolve('./src/components/pages'),
      },
    },
  },
  transpileDependencies: ['vuetify'],

  devServer: {
    host: 'localhost',

    port: 9000,
    proxy: {
      '^/api/*': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  publicPath:
    process.env.NODE_ENV === 'production' ? '/app/' + name + '/' : '/',
};
