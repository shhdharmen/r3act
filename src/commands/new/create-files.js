import fs from "fs";
import path from "path";
import license from "spdx-license-list/licenses/MIT";
import Conf from "conf";
import execa from "execa";
import ncp from "ncp";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);
const copy = promisify(ncp);

export async function createConfFile(options) {
  const config = new Conf({
    cwd: options.targetDirectory,
    configName: "r3act"
  });
  config.set("style", options.style);
  config.set("routing", options.routing);
}

export async function createLicense(options) {
  const targetPath = path.join(options.targetDirectory, "LICENSE");
  const licenseContent = license.licenseText
    .replace("<year>", new Date().getFullYear())
    .replace(
      "<copyright holders>",
      `${options.authorName} (${options.authorEmail})`
    );
  return writeFile(targetPath, licenseContent, "utf8");
}

export async function initGit(options) {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize git"));
  }
}

export async function initReactProject(options) {
  await copyTemplateFiles(options);
}

function copyTemplateFiles(options) {
  return copy(
    path.join(options.templateDirectory, "basic"),
    options.targetDirectory,
    {
      clobber: false
    }
  );
}

export async function installDependencies(options) {
  const result = await execa("npm", ["i"], {
    cwd: options.targetDirectory
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to install dependencies"));
  }
}
