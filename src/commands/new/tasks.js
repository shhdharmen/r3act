import { promisify } from "util";
import ncp from "ncp";
import path from "path";
import glob from "glob";
import fs from "fs";
import execa from "execa";

const copy = promisify(ncp);
const renameFile = promisify(fs.rename);

export const TASKS = {
  copyFiles,
  renameCSSFiles,
  installDependencies
};

async function copyFiles(options, template) {
  return copy(
    path.join(options.templateDirectory, template),
    options.targetDirectory,
    {
      filter: fileName => fileName !== "_config.json",
      clobber: true
    }
  );
}
async function renameCSSFiles(options) {
  return new Promise((resolve, reject) => {
    glob("**/*.css", { cwd: options.targetDirectory }, (err, files) => {
      if (err) {
        reject(new Error("Failed to rename css files"));
      }
      files.forEach(async filePath => {
        const lastIndexOfCSS = filePath.lastIndexOf(".c");
        await renameFile(
          path.join(options.targetDirectory, filePath),
          path.join(
            options.targetDirectory,
            filePath.substring(0, lastIndexOfCSS) + ".scss"
          )
        );
        resolve();
      });
    });
  });
}
async function installDependencies(options, packages) {
  const result = await execa("npm", ["i", ...packages], {
    cwd: options.targetDirectory
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to install dependencies"));
  }
}
