'use strict';

const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  appIndexJs: resolveApp('src/index.js'),
  appHtml: resolveApp('public/index.html'),
  appNodeModules: resolveApp('node_modules'),
  appSrc: resolveApp('src'),
  appDist: resolveApp('dist'),
  appPublic: resolveApp('public'),
  appRoot: resolveApp('.')
};
