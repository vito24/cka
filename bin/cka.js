#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs-extra");
const program = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const vfs = require("vinyl-fs");
const through2 = require("through2");
const leftPad = require("left-pad");
const npmInstall = require("./install");

// console.log("process.argv", process.argv);
// program.help();

program.version(require("../package").version);

program
  .command("new [name]")
  .alias("n")
  .description("create a new project")
  .action(function(name) {
    // create a new project
    if (!name) {
      console.error(chalk.red("The name of project can't be null!"));
      process.exit();
    }
    const projectDir = path.join(process.cwd(), name);
    if (fs.existsSync(projectDir)) {
      console.error(chalk.red("The folder already exists"));
      process.exit();
    }
    fs.mkdirpSync(projectDir);
    process.chdir(projectDir);
    const cwd = path.join(__dirname, "../template");
    const dest = process.cwd();
    const projectName = path.basename(dest);
    const spinner = ora("downloading template \n");
    spinner.start();
    vfs
      .src(["**/*", "!node_modules/**/*"], {
        cwd: cwd,
        cwdbase: true,
        dot: true
      })
      .pipe(template(cwd))
      .pipe(vfs.dest(dest))
      .on("end", function() {
        spinner.stop();
        console.log(chalk.green("\n download success! \n"));
        console.log(chalk.green.bold(leftPad("run", 12)) + " npm install");
        npmInstall(function() {
          // success install callback
          console.log(
            chalk.green("Successfully create " + projectName + " at " + dest)
          );
        });
      })
      .resume();
  });

program.parse(process.argv);

function template(cwd) {
  return through2.obj(function(file, enc, cb) {
    if (!file.stat.isFile()) {
      return cb();
    }
    console.log(
      `${chalk.green.bold(leftPad("create", 12))}  ${file.path.replace(
        cwd + "/",
        ""
      )}`
    );
    this.push(file);
    cb();
  });
}
