import { deleteUsers } from "src/db/queries/users";
import type { CommandHandler } from "./types";

export const commandReset: CommandHandler = async (_cmdName: string, ..._args: string[]) => {
  try {
    await deleteUsers();
    console.log(`All users deleted`);
  } catch (err) {
    throw new Error("Couldn't delete Users. Reset failed");
  }
};
