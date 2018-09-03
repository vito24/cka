'use strict';

const shell = require('shelljs');
const inquirer = require('inquirer');

const pkg = require('../package');

inquirer
  .prompt([
    {
      type: 'list',
      name: 'versionType',
      message: 'Please select version type',
      choices: ['alpha', 'beta', 'release'],
      default: 'release'
    },
    {
      type: 'input',
      name: 'version',
      message: 'Please input version',
      default: function(answer) {
        console.log('answer', answer);
        return `${pkg.version}-${answer.versionType}.1`;
      }
    },
    {
      type: 'confirm',
      name: 'gitPush',
      message: 'Do you want to push your code?',
      default: true
    }
  ])
  .then(receipt => {
    console.log('\nOrder receipt:', receipt);
    const { version } = receipt;
    pkg.version = version;
    shell.ShellString(JSON.stringify(pkg, null, 2)).to('package.json');
    shell.exec(`git commit -am 'Publish version ${version}'`);
    shell.exec(`git tag ${version}`);
  });
