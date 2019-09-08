import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import Listr from 'listr'
import { projectInstall } from 'pkg-install'

import { initChecks } from './init-checks'
import { copyTemplateFiles } from './copy-files'
import logs from '../lib/logs'
import {
  createConfFile,
  createGitignore,
  createLicense,
  initGit
} from './create-files'
import { updateFiles } from './update-files'

const access = promisify(fs.access)

export async function createProject (options) {
  options = {
    ...options,
    targetDirectory: path.join(process.cwd(), options.projectName)
  }

  const templateDir = path.resolve(
    __filename,
    '../../../templates',
    options.template.toLowerCase()
  )
  options.templateDirectory = templateDir
  try {
    await access(templateDir, fs.constants.R_OK)
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'))
    process.exit(1)
  }

  const tasks = new Listr(
    [
      {
        title: 'Checking few things',
        task: () => initChecks(options)
      },
      {
        title: 'Make project dir and copy project files',
        task: () => copyTemplateFiles(options)
      },
      {
        title: 'Create conf file',
        task: () => createConfFile(options)
      },
      {
        title: 'Create gitignore',
        task: () => createGitignore(options)
      },
      {
        title: 'Create License',
        task: () => createLicense(options),
        skip: () =>
          !options.license
            ? 'Pass --license to automatically create MIT license'
            : undefined
      },
      {
        title: 'Update Files',
        task: () => updateFiles(options)
      },
      {
        title: 'Initialize git',
        task: () => initGit(options),
        skip: () =>
          !options.git
            ? 'Pass --git to automatically initialize git'
            : undefined
      },
      {
        title: 'Install dependencies',
        task: () =>
          projectInstall({
            cwd: options.targetDirectory
          }),
        skip: () =>
          !options.install
            ? 'Pass --install to automatically install dependencies'
            : undefined
      }
    ],
    {
      exitOnError: false
    }
  )

  await tasks.run()

  logs.success('Project ready.')
  return true
}
