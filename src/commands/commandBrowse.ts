import type { UserCommandHandler } from "./types";
import { getPostsForUser } from "../db/queries/posts";
import { User } from "src/db/schema";

export const commandBrowse: UserCommandHandler = async (
  _cmdName: string,
  user: User,
  limitArg?: string
) => {
  const limit = limitArg ? parseInt(limitArg) : 2;

  const posts = await getPostsForUser(user.id, limit);

  if (posts.length === 0) {
    console.log("No posts found yet. Run the aggregator (agg) to start collecting posts.");
    return;
  }

  console.log(`📖 Latest posts for ${user.name} (${posts.length} shown):\n`);

  posts.forEach((post, i) => {
    console.log(`${i + 1}. ${post.title}`);
    console.log(`   Feed: ${post.feedName}`);
    if (post.publishedAt) {
      console.log(`   Published: ${post.publishedAt.toISOString().split('T')[0]}`);
    }
    console.log(`   URL : ${post.url}`);
    console.log("");
  });
};
