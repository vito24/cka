#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs-extra");
const program = require("commander");
const chalk = require("chalk");

// console.log("process.argv", process.argv);
// program.help();

program.version(require("../package").version);

program
  .command("new [name]")
  .alias("n")
  .description("create a new project")
  .action((name = "cka-demo") => {
    // create a new project
    const projectDir = path.join(process.cwd(), name);
    if (fs.existsSync(projectDir)) {
      console.error(chalk.red("The folder already exists"));
      process.exit();
    }
    fs.mkdirpSync(projectDir);
    process.chdir(projectDir);
    const templateDir = path.join(__dirname, 'template');
    console.log("=====", templateDir);
  });

program.parse(process.argv);
