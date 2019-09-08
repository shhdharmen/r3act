import files from '../lib/files'
import logs from '../lib/logs'

export async function initChecks (options) {
  if (files.directoryExists(options.projectName)) {
    logs.error(`${options.projectName} directory already exists!!!`)
    process.exit()
  }
}
