import fs from 'fs'
import path from 'path'
import gitignore from 'gitignore'
import license from 'spdx-license-list/licenses/MIT'
import Conf from 'conf'
import execa from 'execa'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const writeGitignore = promisify(gitignore.writeFile)

export async function createConfFile (options) {
  const config = new Conf({
    cwd: options.targetDirectory,
    configName: 'r3act'
  })
  config.set('key', 'value')
}

export async function createGitignore (options) {
  const file = fs.createWriteStream(
    path.join(options.targetDirectory, '.gitignore'),
    { flags: 'a' }
  )
  return writeGitignore({
    type: 'Node',
    file: file
  })
}

export async function createLicense (options) {
  const targetPath = path.join(options.targetDirectory, 'LICENSE')
  const licenseContent = license.licenseText
    .replace('<year>', new Date().getFullYear())
    .replace('<copyright holders>', `${options.authorName} (${options.authorEmail})`)
  return writeFile(targetPath, licenseContent, 'utf8')
}

export async function initGit (options) {
  const result = await execa('git', ['init'], {
    cwd: options.targetDirectory
  })
  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'))
  }
}
