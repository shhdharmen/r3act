import path from "path";
import Listr from "listr";

import logs from "../../lib/logs";
import {
  createConfFile,
  createLicense,
  initReactProject,
  installDependencies,
  initGit
} from "./create-files";
import { updateFiles } from "./update-files";

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: path.join(process.cwd(), options.projectName)
  };

  const currentFileUrl = __filename;
  const templateDir = path.resolve(
    currentFileUrl,
    "../../../../templates",
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;
  console.log(templateDir);

  const tasks = new Listr(
    [
      {
        title: "Create React project",
        task: () => initReactProject(options)
      },
      {
        title: "Create conf file",
        task: () => createConfFile(options)
      },
      {
        title: "Create License",
        task: () => createLicense(options),
        skip: () =>
          !options.license
            ? "Pass --license to automatically create MIT license"
            : undefined
      },
      {
        title: "Update files",
        task: () => updateFiles(options)
      },
      {
        title: "Install dependencies",
        task: () => installDependencies(options)
      },
      {
        title: "Initialize Git",
        task: () => initGit(options)
      }
    ],
    {
      exitOnError: true
    }
  );

  await tasks.run();

  logs.success("Project ready.");
  return true;
}
