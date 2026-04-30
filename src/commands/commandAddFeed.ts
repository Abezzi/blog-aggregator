import { createFeed } from "../db/queries/feeds";
import type { UserCommandHandler } from "./types";
import type { Feed, User } from "../db/schema.ts";
import { createFeedFollow } from "src/db/queries/feedFollows";

// helper to print feed nicely
function printFeed(feed: Feed, userName: string) {
  console.log(`✅ Feed added successfully, following`);
  console.log(`   Name : ${feed.name}`);
  console.log(`   URL  : ${feed.url}`);
  console.log(`   User : ${userName}`);
  console.log(`   ID   : ${feed.id}`);
}

export const commandAddFeed: UserCommandHandler = async (
  _cmdName: string,
  user: User,
  ...args: string[]
) => {
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
    // create the feed linked to the current user
    const newFeed = await createFeed(trimmedName, trimmedUrl, user.id);

    // auto-follow the feed
    await createFeedFollow(user.id, newFeed.id);

    // print the result
    printFeed(newFeed, user.name);
  } catch (error: any) {
    console.error("Failed to add feed:", error.message);
    throw error;
  }
};
