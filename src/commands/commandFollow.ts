import { createFeedFollow, getFeedByUrl, getFeedFollowsForUser } from "../db/queries/feedFollows";
import type { UserCommandHandler } from "./types";
import { User } from "src/db/schema";

export const commandFollow: UserCommandHandler = async (
  _: string,
  user: User,
  url: string
) => {
  if (!url) {
    throw new Error("Usage: follow <feed_url>");
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) throw new Error("URL cannot be empty");

  const feed = await getFeedByUrl(trimmedUrl);

  if (!feed) {
    throw new Error(`Feed with URL "${trimmedUrl}" not found. Add it first using addfeed.`);
  }

  // check if i'm following already
  const userFollows = await getFeedFollowsForUser(user.id);
  for (let follow of userFollows) {
    if (follow.feedUrl === url) {
      console.log("🤓 You already follow this feed, run the command 'following' to check your follows.")
      return;
    }
  }

  const result = await createFeedFollow(user.id, feed.id);

  console.log(`✅ Now following: "${result.feedName}"`);
  console.log(`   User: ${result.userName}`);
};
