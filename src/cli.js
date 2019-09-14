#!/usr/bin/env node
import showBanner from "./lib/banner";
import { prepareCommander } from "./lib/commander";

export async function cli(args) {
  showBanner();
  await prepareCommander(args);
}
