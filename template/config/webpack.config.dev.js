'use strict';

const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const baseConfig = require('./webpack.config.base');
const paths = require('./paths');

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = merge(baseConfig, {
  // enable useful tools for development
  mode: 'development',
  devtool: 'cheap-module-source-map',
  output: {
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          {
            test: /\.(js|jsx)$/,
            enforce: 'pre',
            include: paths.appSrc,
            exclude: /node_modules/,
            loader: 'babel-loader'
          },
          {
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use a plugin to extract that CSS to a file, but
            // in development "style" loader enables hot editing of CSS.
            // By default we support CSS Modules with the extension .css
            test: /\.(?:le|c)ss$/,
            use: [
              {
                loader: 'style-loader'
              },
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  // enable css modules
                  modules: true,
                  localIdentName: '[name]__[local]___[hash:base64:5]'
                }
              },
              {
                loader: 'less-loader'
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      flexbox: 'no-2009'
                    })
                  ]
                }
              }
            ]
          },
          {
            test: /\.(png|bmp$|jpe?g|gif)$/,
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          },
          {
            exclude: [/\.(js|jsx|html|json)/],
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    // static file location
    contentBase: paths.appDist,
    // enable gzip compression
    compress: true,
    // hot module replacement. Depends on HotModuleReplacementPlugin
    hot: true,
    port: 9001,
    // open browser automatically
    open: true,
    // support html5 history api
    historyApiFallback: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebook/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ]
});
