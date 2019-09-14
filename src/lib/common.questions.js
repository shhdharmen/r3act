import chalk from "chalk";
import inquirer from "inquirer";

export async function askForName(whatName) {
  const questions = [];
  questions.push({
    type: "input",
    name: "whatName",
    message: chalk.bold(`What name would you like to use for new ${whatName}?`),
    validate: input => {
      if (!input) {
        return "Please provide component name.";
      }
      return true;
    }
  });
  const answers = await inquirer.prompt(questions);
  return answers.whatName;
}
