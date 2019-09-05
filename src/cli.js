import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";
import chalk from "chalk";
import figlet from "figlet";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install"
    },
    {
      argv: rawArgs.slice(2)
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    template: args._[0],
    runInstall: args["--install"] || false
  };
}

async function promptForMissingOptions(options) {
  const defaultOptions = {
    git: true,
    template: "Javascript",
    runInstall: true
  };
  if (options.skipPrompts) {
    return {
      ...options,
      git: options.git || defaultOptions.git,
      template: options.template || defaultOptions.template,
      runInstall: options.runInstall || defaultOptions.runInstall
    };
  } else {
    const questions = [];
    if (!options.template) {
      questions.push({
        type: "list",
        name: "template",
        message: "Please choose which project template to use",
        choices: ["JavaScript", "TypeScript"],
        default: defaultOptions.template
      });
    }

    if (!options.git) {
      questions.push({
        type: "confirm",
        name: "git",
        message: "Initialize a git repository?",
        default: defaultOptions.git
      });
    }

    if (!options.runInstall) {
      questions.push({
        type: "confirm",
        name: "runInstall",
        message: "Install dependencies?",
        default: defaultOptions.runInstall
      });
    }

    const answers = await inquirer.prompt(questions);
    return {
      ...options,
      template: options.template || answers.template,
      git: options.git || answers.git,
      runInstall: options.runInstall || answers.runInstall
    };
  }
}

export async function cli(args) {
  showBanner();
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}
function showBanner() {
  console.log(chalk.blueBright(figlet.textSync("create-project")));
}
