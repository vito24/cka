'use strict';

const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const autoprefixer = require('autoprefixer');
const baseConfig = require('./webpack.config.base');
const paths = require('./paths');

// `MiniCSSExtractPlugin` extracts styles into CSS
// "css" loader resolves paths in CSS and adds assets as dependencies.
// By default we support CSS Modules with the extension .less|css
// "postcss" loader applies autoprefixer to our CSS.
// If you use code splitting, async bundles will have their own separate CSS chunk file.
const getStyleLoaderConfig = ({ modules = false } = {}) => {
  const cssLoaderConfig = {
    importLoaders: 1
  };
  if (modules) {
    const cssModulesConfig = {
      // enable css modules
      modules: true,
      sourceMap: true,
      localIdentName: '[name]__[local]___[hash:base64:5]'
    };
    Object.assign(cssLoaderConfig, cssModulesConfig);
  }
  return [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: cssLoaderConfig
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
    },
    {
      loader: 'less-loader',
      options: {
        importLoaders: 2,
        javascriptEnabled: true,
        sourceMap: true
      }
    }
  ];
};

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = merge(baseConfig, {
  // enable many optimizations for production builds
  mode: 'production',
  // Don't attempt to continue if there are any errors.
  bail: true,
  devtool: 'source-map',
  output: {
    path: paths.appDist,
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(js|jsx)$/,
            enforce: 'pre',
            include: paths.appSrc,
            exclude: /node_modules/,
            loader: 'babel-loader'
          },
          {
            // enable CSS Modules if files are not in node_modules
            test: /\.(less|css)$/,
            exclude: /node_modules/,
            use: getStyleLoaderConfig({ modules: true })
          },
          {
            test: /\.(less|css)$/,
            include: /node_modules/,
            use: getStyleLoaderConfig()
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
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      // Absolute path to your webpack root folder (paths appended to this)
      // Default: root of your package
      root: paths.appRoot,
      // Write logs to console.
      verbose: true
    }),
    new CopyWebpackPlugin([
      {
        from: paths.appPublic,
        to: paths.appDist,
        ignore: ['.html']
      }
    ]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'static/css/[name].[chunkhash:8].css',
      chunkFilename: 'static/css/[id].[chunkhash:8].css'
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        sourceMap: true,
        // Enable file caching
        cache: true,
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true
      }),
      // Search for CSS assets during the Webpack build and will optimize \ minimize the CSS
      new OptimizeCSSAssetsPlugin()
    ],
    // Automatically split vendor and commons
    splitChunks: {
      chunks: 'all',
      name: 'vendors'
    },
    // Keep the runtime chunk seperated to enable long term caching
    // https://twitter.com/wSokra/status/969679223278505985
    runtimeChunk: true
  }
});
