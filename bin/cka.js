#!/usr/bin/env node
'use strict';

const program = require('commander');

program
  .version(require('../package').version, '-v, --version')
  .description('cka-cli')
  .command('new [name]', 'create a new project').alias('n')
  .parse(process.argv);