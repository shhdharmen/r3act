import program from 'commander'
import inquirer from 'inquirer'
import { createProject } from '../main'
const packageJson = require('../../package.json')
const defaultOptions = require('../options.json')

export async function prepareCommander (rawArgs) {
  program
    .version(packageJson.version)
    .description('A CLI for React')
    .usage('<command> [options]')
    .on('--help', () => {
      console.log('')
    })
  // Create a project
  // $ create-project init projectName [arguments]
  program
    .command('new [project-name]') // projectName = name, optional, if not provided, we will ask
    .description('Create a project')
    .usage('[project-name] [options]')
    .option('-y, --skip-prompts', 'Use defaults', false)
    .option('-i, --install', 'Install dependencies', defaultOptions.install)
    .option('-g, --git', 'Initialize git repo', defaultOptions.git)
    .option('-l, --license', 'Create MIT License', defaultOptions.license)
    .option('--author-name [author-name]', 'Author name', defaultOptions.authorName)
    .option('--author-email [author-email]', 'Author email', defaultOptions.authorEmail)
    .action(async function (projectName, args) {
      let options = Object.assign({}, args)
      if (!projectName) {
        const questions = []
        questions.push({
          type: 'input',
          name: 'projectName',
          message: 'What is project name?',
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

  // allow commander to parse `process.argv`
  program.parse(rawArgs)

  if (!rawArgs.slice(2).length) {
    program.outputHelp()
    console.log('')
  }
}

async function promptForMissingOptions () {
  const questions = []
  questions.push({
    type: 'list',
    name: 'template',
    message: 'Please choose which project template to use',
    choices: ['JavaScript', 'TypeScript'],
    default: defaultOptions.template
  })

  const answers = await inquirer.prompt(questions)
  return {
    template: answers.template
  }
}
