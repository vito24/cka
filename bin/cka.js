#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs-extra');
const program = require('commander');
const childProcess = require('child_process');

console.log('process.argv', process.argv, process.argv.slice(3));
// program.help();

program.version(require('../package').version).parse(process.argv);

const args = process.argv.slice(3);
const subcmd = program.args[0];

if (!subcmd) {
  program.help();
} else {
  const bin = executable(subcmd);
  if (bin) {
    console.log(bin);
    console.log('======', subcmd, bin);
    childProcess.spawn(bin, args, {
      stdio: 'inherit',
      customFds: [0, 1, 2]
    }).on('close', function(code) {
      process.exit(code);
    });
  } else {
    program.help();
  }
}

function executable(subcmd) {
  const file = path.join(__dirname, subcmd);
  if (fs.existsSync(file)) {
    return file;
  }
}
