const path = require('path');

var MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, './src/');
const DIST_DIR = path.resolve(__dirname, './dist/')


const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.resolve(__dirname, './src/index.html'),
  filename: path.resolve(__dirname, './dist/index.html'),
  inject: 'body'
});



module.exports = {

  entry: {
    main: SRC_DIR + '/index.tsx',
  },
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    path: DIST_DIR,
    publicPath: '/',
  },
  mode: "development",
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              fix: true,
              failOnHint: true,
              emitErrors: false,
            }
          }
        ]
      },
      {
        test: /\.(t|j)sx?$/,
        include: SRC_DIR,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader',
          },
        ]
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.s?css$/,
        use: [
          { loader: 'css-hot-loader' },
          { loader: MiniCssExtractPlugin.loader},
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: true,
            }
          },
          {
            loader: "postcss-loader"
          },
          {
            loader: "sass-loader",  // compiles Sass to CSS
          },          
        ]
      },
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig,
    // new HtmlWebpackHarddiskPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/app.[name].css"
    }),
  ]
};