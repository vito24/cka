const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');

module.exports = merge(baseConfig, {
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
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, '../src')],
        exclude: [/[/\\\\]node_modules[/\\\\]/],
        enforce: 'pre',
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    compress: true,
    hot: true,
    port: 9000,
    open: true // open browser automatically
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
});
