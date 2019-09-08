import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

export async function updateFiles (options) {
  await updateReadmeFile(options)
  await updatePackageFile(options)
}

async function updateReadmeFile (options) {
  const readmePath = path.join(options.targetDirectory, 'README.md')
  let readmeContent = await readFile(readmePath, { encoding: 'utf-8' })
  readmeContent = readmeContent.replace(/(\[PROJECT-NAME\])/g, options.projectName)
  return writeFile(readmePath, readmeContent)
}

async function updatePackageFile (options) {
  const packagePath = path.join(options.targetDirectory, 'package.json')
  let packageContent = await readFile(packagePath, { encoding: 'utf-8' })
  packageContent = packageContent.replace(/(\[PROJECT-NAME\])/g, options.projectName)
  packageContent = packageContent.replace(/(\[AUTHOR-NAME\])/g, options.authorName)
  packageContent = packageContent.replace(/(\[AUTHOR-EMAIL\])/g, options.authorEmail)
  return writeFile(packagePath, packageContent)
}
