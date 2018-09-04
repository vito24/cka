'use strict';

const shell = require('shelljs');
const inquirer = require('inquirer');
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
      name: 'versionType',
      message: 'Please select version type.',
      choices: ['alpha', 'beta', 'release'],
      default: 'release'
    },
    {
      type: 'input',
      name: 'version',
      message: 'Please input version',
      default({ versionType }) {
        const [lastVersion, lastVersionTypeAndNum] = pkg.version.split('-');
        const getNextVersion = () => {
          const splitLastVersion = lastVersion.split('.');
          splitLastVersion.splice(2, 1, parseInt(splitLastVersion[2]) + 1);
          return splitLastVersion.join('.');
        };
        if (versionType === 'release') {
          return getNextVersion();
        } else {
          let nextVersionNum = 0;
          let nextVersion = lastVersion;
          if (lastVersionTypeAndNum) {
            const [lastVersionType, lastVersionNum] = lastVersionTypeAndNum.split('.');
            if (lastVersionType === versionType) {
              nextVersionNum = parseInt(lastVersionNum) + 1;
            } else if (versionType === 'alpha') {
              nextVersion = getNextVersion();
            }
          } else {
            nextVersion = getNextVersion();
          }
          return `${nextVersion}-${versionType}.${nextVersionNum}`;
        }
      },
      validate(value) {
        try {
          const versions = shell.exec(`npm info ${pkg.name} versions`);
          return versions.includes(value) ? 'This version already exists.' : true;
        } catch (e) {
          message.error(
            '\nAn error occurred while getting npm package info, please check your network and retry.'
          );
          process.exit(1);
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
