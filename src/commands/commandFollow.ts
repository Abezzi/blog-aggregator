import { createFeedFollow, getFeedByUrl, getFeedFollowsForUser } from "../db/queries/feedFollows";
import { readConfig } from "../config";
import type { CommandHandler } from "./types";
import { getUserByName } from "src/db/queries/users";

export const commandFollow: CommandHandler = async (_: string, url: string) => {
  if (!url) {
    throw new Error("Usage: follow <feed_url>");
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) throw new Error("URL cannot be empty");

  // get current user from gatorconfig.json file
  const config = readConfig();
  if (!config.currentUserName) {
    throw new Error("You must be logged in to follow a feed.");
  }

  // get current user from db
  const currentUser = await getUserByName(config.currentUserName);
  if (!currentUser) {
    throw new Error("Something went wrong loading the current user.");
  }

  const feed = await getFeedByUrl(trimmedUrl);

  if (!feed) {
    throw new Error(`Feed with URL "${trimmedUrl}" not found. Add it first using addfeed.`);
  }

  // check if i'm following already
  const userFollows = await getFeedFollowsForUser(currentUser.id);
  for (let follow of userFollows) {
    if (follow.feedUrl === url) {
      console.log("🤓 You already follow this feed, run the command 'feeds' to check your feeds.")
      return;
    }
  }

  const result = await createFeedFollow(currentUser.id, feed.id);

  console.log(`✅ Now following: "${result.feedName}"`);
  console.log(`   User: ${result.userName}`);
};
