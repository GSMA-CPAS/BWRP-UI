const fs = require('fs');
const webpack = require('webpack');
const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;
const name = JSON.parse(packageJson).name || 'undefined';

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: '"' + version + '"',
        },
      }),
    ],
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
