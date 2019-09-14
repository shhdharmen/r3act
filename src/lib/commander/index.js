#!/usr/bin/env node
import program from "commander";
import { prepareNewCommand } from "./new.command.js";
import { prepareGenerateCommand } from "./generate.command.js";
const packageJson = require("../../../package.json");

export async function prepareCommander(rawArgs) {
  program
    .version(packageJson.version)
    .description("A CLI for React")
    .usage("<command> [options]")
    .on("--help", () => {
      console.log("");
    });

  // Create a project
  // $ r3act new [project-name] [options]
  await prepareNewCommand(rawArgs);

  // Generate a component
  // $ r3act generate [schematic] [options]
  await prepareGenerateCommand(rawArgs);

  // allow commander to parse `process.argv`
  program.parse(rawArgs);

  if (!rawArgs.slice(2).length) {
    program.outputHelp();
    console.log("");
  }
}
