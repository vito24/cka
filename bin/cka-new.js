#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const program = require('commander');
const ora = require('ora');
const vfs = require('vinyl-fs');
const through2 = require('through2');
const npmInstall = require('./install');
const message = require('./message');

program
  .option(
    '-n, --no-install',
    "Don't execute 'npm install' after cerating project."
  )
  .parse(process.argv);

const args = program.args;
const name = program.args[0];

if (!args.length) {
  console.error('Project name is required!');
  program.help();
}

const projectDir = path.join(process.cwd(), name);
if (fs.existsSync(projectDir)) {
  message.error('The folder already exists!');
  process.exit();
}
fs.mkdirpSync(projectDir);
process.chdir(projectDir);
const cwd = path.join(__dirname, '../template');
const dest = process.cwd();
const projectName = path.basename(dest);
const spinner = ora('downloading template \n');
spinner.start();
vfs
  .src(['**/*', '!node_modules/**/*'], {
    cwd: cwd,
    cwdbase: true,
    dot: true
  })
  .pipe(template(cwd))
  .pipe(vfs.dest(dest))
  .on('end', function() {
    spinner.stop();
    message.success('\n download success! \n');
    if (program.install) {
      message.info('run', ' npm install');
      npmInstall(function() {
        // success install callback
        message.success(`Successfully create ${projectName} at ${dest}.`);
      });
    }
  })
  .resume();

function template(cwd) {
  return through2.obj(function(file, enc, cb) {
    if (!file.stat.isFile()) {
      return cb();
    }
    message.info('create', file.path.replace(cwd + '/', ''));
    this.push(file);
    cb();
  });
}
