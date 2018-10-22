'use strict';

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const openBrowser = require('react-dev-utils/openBrowser');
const { choosePort, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
const webpackConfig = require('../config/webpack.config.dev');
const paths = require('../config/paths');
const packageJson = require(paths.appPackageJson);

const isInteractive = process.stdout.isTTY;

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 9000;
const HOST = process.env.HOST || '0.0.0.0';

choosePort(HOST, DEFAULT_PORT)
  .then(port => {
    if (port == null) {
      // We have not found a port.
      return;
    }

    const options = {
      // static file location
      contentBase: paths.appPublic,
      watchContentBase: true,
      // enable gzip compression
      compress: true,
      // hot module replacement. Depends on HotModuleReplacementPlugin
      hot: true,
      // support html5 history api
      historyApiFallback: true,
      // show errors in the browser
      overlay: true,
      quiet: true,
      proxy: packageJson.proxy,
      publicPath: webpackConfig.output.publicPath,
      port,
      host: HOST
    };

    WebpackDevServer.addDevServerEntrypoints(webpackConfig, options);
    const compiler = webpack(webpackConfig);

    const server = new WebpackDevServer(compiler, options);
    server.listen(port, HOST, error => {
      if (error) {
        return console.log(error);
      }
      if (isInteractive) {
        clearConsole();
      }
      console.log(chalk.cyan('Starting server......\n'));
      const urls = prepareUrls(protocol, HOST, port);
      openBrowser(urls.localUrlForBrowser);
    });
  })
  .catch(error => {
    if (error && error.message) {
      console.log(error.message);
    }
    process.exit(1);
  });
