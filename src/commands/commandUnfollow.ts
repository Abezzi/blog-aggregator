import { getFeedByUrl, getFeedFollowsForUser, unfollowFeed } from "../db/queries/feedFollows";
import type { UserCommandHandler } from "./types";
import { User } from "src/db/schema";

export const commandUnfollow: UserCommandHandler = async (
  _: string,
  user: User,
  url: string
) => {
  if (!url) {
    throw new Error("Usage: unfollow <feed_url>");
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) throw new Error("URL cannot be empty");

  const feed = await getFeedByUrl(trimmedUrl);

  if (!feed) {
    throw new Error(`Feed with URL "${trimmedUrl}" not found. Add it first using addfeed.`);
  }

  // check if the user is following already
  const userFollows = await getFeedFollowsForUser(user.id);

  for (let follow of userFollows) {
    if (follow.feedUrl === url) {
      const unfollowedFeed = await unfollowFeed(user.id, trimmedUrl);
      console.log(`✅ Successfully unfollowing: "${unfollowedFeed.name}"`);
      console.log(`    URL: ${trimmedUrl}`);
      return;
    } else {
      console.log("🤔 You don't even follow this feed, run the command 'following' to check your follows.")
      return;
    }
  }
};
