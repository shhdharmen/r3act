import program from 'commander'
import inquirer from 'inquirer'
import chalk from 'chalk'
import files from '../files'
import logs from '../logs'
const defaultOptions = require('../../options.json').commands.generate

export async function prepareGenerateCommand (rawArgs) {
  program
    .command('generate [schematic]') // schematic = [component, route]
    .description('Generates and/or modifies files based on schematic')
    .usage('[schematic] [options]')
    .option('-y --skip-prompts', 'Use defaults', false)
    .action(async (schematic, args) => {
      if (files.isR3actProject(process.cwd())) {
        let options = {}
        if (!schematic || (schematic.toLowerCase() !== 'component' && schematic.toLowerCase() !== 'route')) {
          const questions = [{
            type: 'list',
            choices: ['Component', 'Route'],
            name: 'schematic',
            message: chalk.bold('Which schematic would you like to use?'),
            default: defaultOptions.schematic
          }]
          const answers = await inquirer.prompt(questions)
          schematic = answers.schematic.toLowerCase()
        }
        if (args.skipPrompts) {
          options = Object.assign({}, defaultOptions)
        }
        switch (schematic) {
          case 'component':
            console.log('Will generate component')
            break
          case 'route':
            console.log('Will generate route')
            break
          default:
            break
        }
      } else {
        logs.error('Current directory is not r3act project')
      }
    })
}
