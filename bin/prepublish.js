'use strict';

const shell = require('shelljs');
const inquirer = require('inquirer');
const message = require('./message');
const pkg = require('../package');

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
      name: 'versionType',
      message: 'Please select version type.',
      choices: ['alpha', 'beta', 'release'],
      default: 'release'
    },
    {
      type: 'input',
      name: 'version',
      message: 'Please input version',
      default: function({ versionType }) {
        const lastVersion = pkg.version.split('-')[0];
        return versionType === 'release'
          ? lastVersion
          : `${lastVersion}-${versionType}.0`;
      },
      validate: function(value) {
        try {
          const versions = shell.exec(`npm info ${pkg.name} versions`);
          return versions.includes(value)
            ? 'This version already exists.'
            : true;
        } catch (e) {
          message.error(
            '\nAn error occurred while getting npm package info, please check your network and retry.'
          );
          process.exit();
        }
      }
    }
  ])
  .then(({ version }) => {
    pkg.version = version;
    shell.ShellString(JSON.stringify(pkg, null, 2)).to('package.json');
    shell.exec(`git commit -am 'Publish version ${version}'`);
    shell.exec(`git tag ${version}`);
    shell.exec(`git push`);
    shell.exec(`git push --tags`);
  });
