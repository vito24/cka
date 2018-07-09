#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const program = require('commander');

console.log('process.argv', process.argv);
if (process.argv.slice(2).join('') === '-v') {
  const pkg = require('../package');
  console.log('cka-cli version: ' + pkg.version);
}