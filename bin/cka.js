#!/usr/bin/env node
'use strict';

const program = require('commander');

program
  .version(require('../package').version, '-v, --version')
  .description('Fake package manager')
  .command('new [name]', 'create a new project').alias('n')
  .command('search [query]', 'search with optional query').alias('s')
  .command('list', 'list packages installed')
  .command('publish', 'publish the package').alias('p')
  .parse(process.argv);