import { promisify } from "util";
import fs from "fs";
import path from "path";
import { TASKS } from "./tasks";

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

export async function updateFiles(options) {
  await updateReadmeFile(options);
  await updatePackageFile(options);
  await updateTemplateFiles(options);
}

async function updateReadmeFile(options) {
  const readmePath = path.join(options.targetDirectory, "README.md");
  let readmeContent = await readFile(readmePath, { encoding: "utf-8" });
  readmeContent = readmeContent.replace(
    /(\[PROJECT-NAME\])/g,
    options.projectName
  );
  return writeFile(readmePath, readmeContent);
}

async function updatePackageFile(options) {
  const packagePath = path.join(options.targetDirectory, "package.json");
  let packageContent = await readFile(packagePath, { encoding: "utf-8" });
  packageContent = packageContent.replace(
    /(\[PROJECT-NAME\])/g,
    options.projectName
  );
  return writeFile(packagePath, packageContent);
}

async function updateTemplateFiles(options) {
  if (options.style === "scss") {
    const configString = await readFile(
      path.join(options.templateDirectory, "scss", "_config.json"),
      { encoding: "utf8" }
    );
    const config = JSON.parse(configString);
    await performActions(options, config);
  }
  if (options.routing) {
    const configString = await readFile(
      path.join(options.templateDirectory, "routing", "_config.json"),
      { encoding: "utf8" }
    );
    const config = JSON.parse(configString);
    await performActions(options, config);
  }
}

async function performActions(options, config) {
  const tasks = {
    copyFiles: () => TASKS.copyFiles(options, config.template),
    renameCSSFiles: () => TASKS.renameCSSFiles(options),
    installDependencies: () =>
      TASKS.installDependencies(options, config.dependencies)
  };
  config.tasks.forEach(taskName => {
    tasks[taskName]();
  });
}
