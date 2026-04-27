import { setUser, readConfig } from "./config";
import { displayAsciiArt } from "./asciiArt.js";

async function main() {
  // shows the ascii art, app name and author
  displayAsciiArt();

  // set current user
  const userName = "Alex";
  setUser(userName);
  console.log(`Current user set to: ${userName}`);

  // read config back and display it
  const config = readConfig();
  console.log("Config loaded:");
  console.dir(config, { depth: null });
}

main().catch(console.error);
