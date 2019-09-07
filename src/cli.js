import inquirer from "inquirer";
import { createProject } from "./main";
import chalk from "chalk";
import figlet from "figlet";
import program from "commander";

const defaultOptions = {
  git: false,
  template: "Javascript",
  install: false
};

async function prepareCommander(rawArgs) {
  program.usage("<command> [options]");
  // Create a project
  // $ create-project init projectName [arguments]
  program
    .command("new [project-name]") // projectName = name, optional, if not provided, we will ask
    .description("Description: Create a project")
    .usage("[project-name] [options]")
    .option("-y, --skip-prompts", "Use defaults")
    .option("-i, --install", "Install dependencies")
    .option("-g, --git", "Initialize git repo")
    .action(async function(projectName, args) {
      let options = Object.assign({}, args);
      if (!projectName) {
        const questions = [];
        questions.push({
          type: "input",
          name: "projectName",
          message: "What is project name?",
          validate: input => {
            if (!input) {
              return "Please provide project name.";
            }
            return true;
          }
        });
        const answers = await inquirer.prompt(questions);
        projectName = answers.projectName;
      }
      options = Object.assign(options, { projectName });
      if (args.skipPrompts) {
        options = Object.assign(options, defaultOptions);
      } else {
        const missingOptions = await promptForMissingOptions();
        options = Object.assign(options, missingOptions);
      }
      options = Object.assign(options, rawArgs);
      await createProject(options);
    });

  // allow commander to parse `process.argv`
  program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
    console.log("");
  }
}

async function promptForMissingOptions() {
  const questions = [];
  questions.push({
    type: "list",
    name: "template",
    message: "Please choose which project template to use",
    choices: ["JavaScript", "TypeScript"],
    default: defaultOptions.template
  });

  questions.push({
    type: "confirm",
    name: "git",
    message: "Initialize a git repository?",
    default: defaultOptions.git
  });

  const answers = await inquirer.prompt(questions);
  return {
    template: answers.template,
    git: answers.git
  };
}

export async function cli(args) {
  showBanner();
  await prepareCommander(args);
}
function showBanner() {
  console.log(chalk.blueBright(figlet.textSync("r 3 a c t")));
}
