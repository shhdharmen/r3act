import chalk from "chalk";

export default {
  error: msg => {
    console.log(chalk.red(chalk.bold("ERROR: ") + msg));
  },
  info: msg => {
    console.log(chalk.white(chalk.bold("INFO: ") + msg));
  },
  help: msg => {
    console.log(chalk.blueBright(chalk.bold("TIP: ") + msg));
  },
  success: msg => {
    console.log(chalk.greenBright(chalk.bold("SUCCESS: ") + msg));
  }
};
