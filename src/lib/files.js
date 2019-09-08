const fs = require('fs')
const path = require('path')

module.exports = {
  getCurrentDirectoryBase: () => {
    return path.basename(process.cwd())
  },

  directoryExists: filePath => {
    try {
      return fs.statSync(filePath).isDirectory()
    } catch (err) {
      return false
    }
  },

  isR3actProject: filePath => {
    try {
      return fs.statSync(path.join(filePath, 'r3act.json')).isFile()
    } catch (err) {
      return false
    }
  }
}
