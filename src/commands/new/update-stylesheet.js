import { promisify } from "util";
import fs from "fs";
import path from "path";
import execa from "execa";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const renameFile = promisify(fs.rename);

export async function updateStyleSheet(options) {
  await installNodeSass(options);
  await updateCSSFile(options);
  await updateAppJSFile(options);
}

async function installNodeSass(options) {
  const result = await execa("yarn", ["add", "node-sass"], {
    cwd: options.targetDirectory
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to install node-sass"));
  }
}

async function updateCSSFile(options) {
  const oldName = path.join(options.targetDirectory, "src", "App.css");
  const newName = path.join(options.targetDirectory, "src", "App.scss");
  return renameFile(oldName, newName);
}

async function updateAppJSFile(options) {
  const appJSPath = path.join(options.targetDirectory, "src", "App.js");
  let appJSContent = await readFile(appJSPath, { encoding: "utf-8" });
  appJSContent = appJSContent.replace(
    "import './App.css';",
    "import './App.scss';"
  );
  return writeFile(appJSPath, appJSContent);
}
