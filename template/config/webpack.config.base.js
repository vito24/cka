'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');

module.exports = {
  entry: paths.appIndex,
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml
    }),
    new webpack.DefinePlugin({
      'process.env.BUNDLE_ENV': JSON.stringify(process.env.BUNDLE_ENV)
    })
  ]
};
