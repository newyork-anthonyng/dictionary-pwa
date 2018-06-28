const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
  context: path.resolve(__dirname),

  entry: {
    app: "./app.js",
    "service-worker": "./service-worker.js"
  },

  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].js"
  },

  optimization: {
    minimize: true
  },

  plugins: [
    new CleanWebpackPlugin(["public"]),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
      inject: false,
      minify: {
        minifyCSS: true,
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new CopyWebpackPlugin(["icons/*", "manifest.json"])
  ]
};
