const path = require('path');
const Webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, '../src/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, '../src')],
        exclude: [/[/\\\\]node_modules[/\\\\]/],
        enforce: "pre",
        loader: "babel-loader"
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
        use: [
          'file-loader'
        ]
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
  plugins: [
    new Webpack.HotModuleReplacementPlugin()
  ]
};
