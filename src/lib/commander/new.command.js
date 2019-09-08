import program from 'commander'
import inquirer from 'inquirer'
import { createProject } from '../../commands/new'
import chalk from 'chalk'
const defaultOptions = require('../../options.json').commands.new

export async function prepareNewCommand (rawArgs) {
  program
    .command('new [project-name]') // projectName = name, optional, if not provided, we will ask
    .description('Create a project')
    .usage('[project-name] [options]')
    .option('-y, --skip-prompts', 'Use defaults', false)
    .option('-l, --license', 'Create MIT License', defaultOptions.license)
    .action(async function (projectName, args) {
      let options = Object.assign({}, args)
      if (!projectName) {
        const questions = []
        questions.push({
          type: 'input',
          name: 'projectName',
          message: chalk.bold('What name would you like to use for new project?'),
          validate: input => {
            if (!input) {
              return 'Please provide project name.'
            }
            return true
          }
        })
        const answers = await inquirer.prompt(questions)
        projectName = answers.projectName
      }
      options = Object.assign(options, { projectName })
      if (args.skipPrompts) {
        options = Object.assign(options, defaultOptions)
      } else {
        const missingOptions = await promptForMissingOptions()
        options = Object.assign(options, missingOptions)
      }
      options = Object.assign(options, rawArgs)
      await createProject(options)
    })
}
async function promptForMissingOptions () {
  const questions = []
  questions.push({
    type: 'list',
    name: 'style',
    message: chalk.bold('Which stylesheet format would you like to use?'),
    choices: ['CSS', 'SCSS [https://sass-lang.com/documentation/syntax#scss]'],
    default: defaultOptions.style.toUpperCase()
  })
  const answers = await inquirer.prompt(questions)
  return {
    style: answers.style.split(' ')[0].toLowerCase()
  }
}
