'use strict';

const shell = require('shelljs');
const inquirer = require('inquirer');
const semver = require('semver');
const message = require('./message');
const pkg = require('../package');

let stdin = process.stdin;
stdin.setEncoding('utf8');
stdin.on('data', key => {
  if (key === '\u0003') {
    process.exit(1);
  }
});

['git', 'npm'].forEach(cmd => {
  if (!shell.which(cmd)) {
    message.error(`Please install ${cmd}.`);
    process.exit(1);
  }
});

inquirer
  .prompt([
    {
      type: 'list',
      name: 'releaseType',
      message: 'Please select release type.',
      choices: ['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease'],
      default: 'patch'
    }
  ])
  .then(({ releaseType }) => {
    const questions = [
      {
        type: 'list',
        name: 'versionType',
        message: 'Please select version type.',
        choices: ['alpha', 'beta'],
        default: 'alpha'
      },
      {
        type: 'input',
        name: 'version',
        message: 'Please input version',
        default: ({ versionType }) => semver.inc(pkg.version, releaseType, versionType),
        validate(value) {
          if (!semver.valid(value) || !semver.gt(value, pkg.version)) {
            return `Invalid version(${value}).`;
          }
          try {
            const versions = shell.exec(`npm info ${pkg.name} versions`, {
              silent: true
            });
            return versions.includes(value) ? `Version ${value} already exists.` : true;
          } catch (e) {
            message.error(
              '\nAn error occurred while getting npm package info, please check your network and retry.'
            );
            process.exit(1);
          }
        }
      }
    ];
    if (!releaseType.startsWith('pre')) {
      questions.shift();
    }
    inquirer.prompt(questions).then(({ version }) => {
      pkg.version = version;
      shell.ShellString(JSON.stringify(pkg, null, 2)).to('package.json');
      shell.exec(`git commit -am 'Publish version ${version}'`);
      shell.exec(`git tag ${version}`);
      shell.exec(`git push`);
      shell.exec(`git push --tags`);
    });
  });
