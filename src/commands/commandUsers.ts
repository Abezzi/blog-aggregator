import { getUsers } from "src/db/queries/users";
import type { CommandHandler } from "./types";
import { readConfig } from "src/config";

export const commandUsers: CommandHandler = async (_cmdName: string, ..._args: string[]) => {
  try {
    const users = await getUsers();
    const currentUserName = readConfig().currentUserName;

    for (let user of users) {
      if (user.name === currentUserName) {
        console.log(`* ${user.name} (current)`);
      } else {
        console.log(`* ${user.name}`);
      }
    }
  } catch (err) {
    throw new Error("Couldn't list the users");
  }
};
