const packageJson = require("./package.json");

module.exports = {
  transpileDependencies: ["vuetify"],

  devServer: {
    host: "localhost",

    port: 9000,
    proxy: {
      "^/api/*": {
        target: "http://localhost:3040",
        ws: true,
        changeOrigin: true,
      },
    },
  },

  publicPath:
    process.env.NODE_ENV === "production"
      ? "/app/" + packageJson.name + "/"
      : "/",
};
