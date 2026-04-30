import { getFeedFollowsForUser } from "../db/queries/feedFollows";
import type { UserCommandHandler } from "./types";
import { User } from "src/db/schema";

export const commandFollowing: UserCommandHandler = async (
  _: string,
  user: User,
  ..._args: string[]
) => {
  // query to get the follows
  const follows = await getFeedFollowsForUser(user.id);

  if (follows.length === 0) {
    console.log("You're not following any feeds yet.");
    return;
  }

  console.log(`📋 Feeds you're following (${follows.length}):`);
  for (const f of follows) {
    console.log(`   • ${f.feedName}`);
  }
};
