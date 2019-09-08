import path from 'path'
import Listr from 'listr'

import logs from '../../lib/logs'
import {
  createConfFile,
  createLicense,
  initReactProject
} from './create-files'
import { updateStyleSheet } from './update-stylesheet'

export async function createProject (options) {
  options = {
    ...options,
    targetDirectory: path.join(process.cwd(), options.projectName)
  }

  const tasks = new Listr(
    [
      {
        title: 'Creating React project',
        task: () => initReactProject(options)
      },
      {
        title: 'Create conf file',
        task: () => createConfFile(options)
      },
      {
        title: 'Updating stylesheet',
        task: () => updateStyleSheet(options),
        enabled: () => options.style === 'scss'
      },
      {
        title: 'Create License',
        task: () => createLicense(options),
        skip: () =>
          !options.license
            ? 'Pass --license to automatically create MIT license'
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
