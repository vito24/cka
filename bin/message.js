const chalk = require('chalk');
const leftPad = require('left-pad');

module.exports = {
  success(text) {
    console.log(chalk.green.bold(text));
  },
  error(text) {
    console.log(chalk.red.bold(text));
  },
  info(type, message) {
    console.log(`${chalk.cyan.bold(leftPad(type, 12))}  ${message}`);
  }
};