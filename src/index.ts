import { readConfig } from "./config";
import { displayAsciiArt } from "./asciiArt.js";
import { runCommand, createCommandRegistry } from "./commands";

async function main() {
  // shows the ascii art, app name and author
  displayAsciiArt();

  // register all the commands
  const registry = createCommandRegistry();

  // get arguments from the command line, skipping node and script path
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Error: not enough arguments");
    console.error("Usage: npm run start <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);

  try {
    runCommand(registry, cmdName, ...cmdArgs);

    const config = readConfig();
    // DEBUG: log
    console.log("\nCurrent config:");
    console.dir(config);

  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err.message);
  process.exit(1);
});
