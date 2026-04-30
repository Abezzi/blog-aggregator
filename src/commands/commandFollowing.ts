import { getFeedFollowsForUser } from "../db/queries/feedFollows";
import { readConfig } from "../config";
import type { CommandHandler } from "./types";
import { getUserByName } from "src/db/queries/users";

export const commandFollowing: CommandHandler = async (_: string) => {
  // get current user from gatorconfig.json file
  const config = readConfig();
  if (!config.currentUserName) {
    throw new Error("You must be logged in.");
  }

  // get current user from db
  const currentUser = await getUserByName(config.currentUserName);
  if (!currentUser) {
    throw new Error("Something went wrong loading the current user.");
  }
  const follows = await getFeedFollowsForUser(currentUser.id);

  if (follows.length === 0) {
    console.log("You're not following any feeds yet.");
    return;
  }

  console.log(`📋 Feeds you're following (${follows.length}):`);
  for (const f of follows) {
    console.log(`   • ${f.feedName}`);
  }
};
