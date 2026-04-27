import { setUser } from "../config";
import type { CommandHandler } from "./types";

export const commandLogin: CommandHandler = (cmdName: string, ...args: string[]) => {
  if (args.length === 0) {
    throw new Error("username required for login command");
  }

  const username = args[0];

  setUser(username);
  console.log(`User set to: ${username}`);
};
