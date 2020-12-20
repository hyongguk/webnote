module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
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
