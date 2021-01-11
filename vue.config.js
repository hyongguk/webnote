module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  lintOnSave: false,
  outputDir: "./client/public",
  configureWebpack: {
    entry: "./client/src/main.js"
  },
  devServer: {
    host: "0.0.0.0",
    hot: true,
    public: "0.0.0.0:8080",
    disableHostCheck: true,
    https: false,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
};
