#!/usr/bin/env node
import program from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import files from "../files";
import logs from "../logs";
import { askForName } from "../common.questions";
import { generateModule } from "../../commands/generate";
const defaultOptions = require("../../options.json").commands.generate;

export async function prepareGenerateCommand(rawArgs) {
  program
    .command("generate [schematic] [component-name]") // schematic = [module, component, route], name
    .description("Generates and/or modifies files based on schematic")
    .usage("[schematic] [options]")
    .option("-y --skip-prompts", "Use defaults", false)
    .action(async (schematic, componentName, args) => {
      if (files.isR3actProject(process.cwd())) {
        let options = {};
        if (
          !schematic ||
          (schematic.toLowerCase() !== "component" &&
            schematic.toLowerCase() !== "route" &&
            schematic.toLowerCase() !== "module")
        ) {
          const questions = [
            {
              type: "list",
              choices: ["Module", "Component", "Route"],
              name: "schematic",
              message: chalk.bold("Which schematic would you like to use?"),
              default: defaultOptions.schematic
            }
          ];
          const answers = await inquirer.prompt(questions);
          schematic = answers.schematic.toLowerCase();
        } else {
          schematic = schematic.toLowerCase();
        }
        if (!componentName) {
          componentName = await askForName(schematic);
        }
        if (args.skipPrompts) {
          options = Object.assign({}, defaultOptions);
        }
        switch (schematic) {
          case "module":
            await generateModule(componentName, options);
            break;
          case "component":
            console.log("Will generate component");
            break;
          case "route":
            console.log("Will generate route");
            break;
          default:
            break;
        }
      } else {
        logs.error("Current directory is not r3act project");
      }
    });
}
