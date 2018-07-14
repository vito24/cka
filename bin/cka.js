#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs");
const program = require("commander");

// console.log("process.argv", process.argv);
// process.exit()
// program.help();

program.version(require("../package").version);

program
  .command("new [name]")
  .alias("n")
  .description("create a new project")
  .action((name = 'myApp') => {

    console.log("=====", name);
  });

program.parse(process.argv);
