module.exports = {
  lintOnSave: false,
  outputDir: "./client/public",
  configureWebpack: {
    entry: "./client/src/main.js"
  },
  devServer: {
    proxy: {
      "/": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
};
