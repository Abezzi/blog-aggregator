import { createFeed } from "../db/queries/feeds";
import { readConfig } from "../config";
import type { CommandHandler } from "./types";
import type { Feed } from "../db/schema.ts";
import { getUserByName } from "src/db/queries/users";

// helper to print feed nicely
function printFeed(feed: Feed, userName: string) {
  console.log(`✅ Feed added successfully!`);
  console.log(`   Name : ${feed.name}`);
  console.log(`   URL  : ${feed.url}`);
  console.log(`   User : ${userName}`);
  console.log(`   ID   : ${feed.id}`);
}

export const commandAddFeed: CommandHandler = async (_cmdName: string, ...args: string[]) => {
  const name = args[0];
  const url = args[1];

  if (!name || !url) {
    throw new Error("Usage: addfeed <name> <url>");
  }

  const trimmedName = name.trim();
  const trimmedUrl = url.trim();

  if (!trimmedName || !trimmedUrl) {
    throw new Error("name and url cannot be empty");
  }

  try {
    // get current logged-in user from config + database
    const config = readConfig();
    if (!config.currentUserName) {
      throw new Error("No user logged in. Please login first.");
    }

    const currentUser = await getUserByName(config.currentUserName);
    console.log("current user: ", currentUser);

    if (!currentUser) {
      throw new Error("undefined current user");
    }

    // create the feed linked to the current user
    const newFeed = await createFeed(trimmedName, trimmedUrl, currentUser.id);

    // print the result
    printFeed(newFeed, currentUser.name);
  } catch (error: any) {
    console.error("Failed to add feed:", error.message);
    throw error;
  }
};
