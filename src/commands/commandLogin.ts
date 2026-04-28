import { getUserByName } from "src/db/queries/users";
import { setUser } from "../config";
import type { CommandHandler } from "./types";

export const commandLogin: CommandHandler = async (_cmdName: string, ...args: string[]) => {
  if (args.length === 0) {
    throw new Error("username required for login command");
  }

  const username = args[0];

  // check if user already exists
  const existingUser = await getUserByName(username);

  if (!existingUser) {
    throw new Error(`The username: ${username} doesn't exist in the database`);
  }

  setUser(username);
  console.log(`User set to: ${username}`);
};
