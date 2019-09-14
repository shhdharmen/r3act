import boxen from "boxen";
import figlet from "figlet";
import chalk from "chalk";

export default function showBanner() {
  const boxenOptions = {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "blueBright"
  };
  const msgBox = boxen(
    chalk.blueBright(figlet.textSync("r 3 a c t")),
    boxenOptions
  );
  console.log(msgBox);
}
