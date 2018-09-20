'use strict';

const shell = require('shelljs');
const inquirer = require('inquirer');
const semver = require('semver');
const message = require('./message');
const pkg = require('../package');

checkCmd();
checkGitStatus();

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
            const versions = JSON.parse(
              shell.exec(`npm info ${pkg.name} version --json`, {
                silent: true
              }).stdout
            );
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
    inquirer.prompt(questions).then(({ versionType, version }) => {
      pkg.version = version;
      shell.ShellString(JSON.stringify(pkg, null, 2)).to('package.json');
      shell.exec(`conventional-changelog -p angular -i CHANGELOG.md -s -r 0`);
      shell.exec(`git commit -am 'v${version}'`);
      shell.exec(`git tag v${version}`);
      shell.exec(`git push`);
      shell.exec(`git push --tags`);
      console.log('npm publishing...');
      if (versionType) {
        shell.exec(`npm publish --tag=beta`);
      } else {
        shell.exec(`npm publish`);
      }
    });
  });

/**
 * Check required cmd;
 */
function checkCmd() {
  ['git', 'npm'].forEach(cmd => {
    if (!shell.which(cmd)) {
      message.error(`Please install ${cmd}.`);
      process.exit();
    }
  });
}

/**
 * Check if git working directory is clean.
 */
function checkGitStatus() {
  const gitStatus = shell.exec('git status --porcelain', {
    silent: true
  }).stdout;

  if (gitStatus) {
    message.error('Git working directory is not clean.Please commit your changes firstly.');
    process.exit();
  }
}
