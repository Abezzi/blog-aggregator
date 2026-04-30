import { getUserByName } from "src/db/queries/users";
import { readConfig } from "../config";
import type { CommandHandler, UserCommandHandler } from "./types";

export const middlewareLoggedIn = (handler: UserCommandHandler): CommandHandler => {
  return async (cmdName: string, ...args: string[]) => {
    // get the user from the config file
    const config = readConfig();
    if (!config.currentUserName) {
      throw new Error("You must be logged in to run this command. Use: login <username>");
    }

    // get the full user object from the database
    const user = await getUserByName(config.currentUserName);
    if (!user) {
      throw new Error("User undefined");
    }

    // call the original handler with the user injected
    await handler(cmdName, user, ...args);
  };
};
