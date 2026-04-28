import { createUser, getUserByName } from "src/db/queries/users";
import type { CommandHandler } from "./types";
import { setUser } from "src/config";

export const commandRegister: CommandHandler = async (_cmdName: string, ...args: string[]) => {
  // if no args throw error
  if (args.length === 0) {
    throw new Error("name required for register command");
  }

  const name = args[0].trim();

  // if name is empty throw error
  if (!name) {
    throw new Error("name cannot be empty");
  }

  // check if user already exists
  const existingUser = await getUserByName(name);

  if (existingUser) {
    throw new Error(`User '${name}' already exists. Please choose a different name.`);
  }

  // create new user
  const newUser = await createUser(name);

  console.log(`Created user: ${newUser.name}`);

  // after registering also set the newly created user
  setUser(newUser.name);
};
