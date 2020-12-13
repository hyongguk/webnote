module.exports = {
  lintOnSave: false,
  outputDir: "./client/public",
  configureWebpack: {
    entry: "./client/src/main.js"
  },
  devServer: {
    proxy: "http://localhost:3000"
  }
};
