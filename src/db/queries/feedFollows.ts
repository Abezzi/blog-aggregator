import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { and, eq } from "drizzle-orm";

export async function createFeedFollow(userId: string, feedId: string) {
  await db.insert(feedFollows).values({ userId, feedId }).returning();

  // fetch the full info
  const [result] = await db
    .select({
      feedName: feeds.name,
      feedUrl: feeds.url,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(and(eq(feedFollows.userId, userId), (eq(feedFollows.feedId, feedId))))
    .limit(1);

  if (!result) {
    throw new Error("Failed to create feed follow");
  }

  return result;
}

export async function unfollowFeed(userId: string, feedUrl: string) {
  // find the feed by URL
  const [feed] = await db
    .select({ id: feeds.id, name: feeds.name })
    .from(feeds)
    .where(eq(feeds.url, feedUrl));

  if (!feed) {
    throw new Error(`Feed with URL "${feedUrl}" not found.`);
  }

  // delete the follow record
  const deleted = await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.userId, userId), (eq(feedFollows.feedId, feed.id))))
    .returning();

  if (deleted.length === 0) {
    throw new Error(`You are not following the feed: "${feed.name}"`);
  }
  // return the feed info for nice output
  return feed;
}

export async function getFeedFollowsForUser(userId: string) {
  return await db
    .select({
      feedFollowId: feedFollows.id,
      feedId: feeds.id,
      feedName: feeds.name,
      feedUrl: feeds.url,
      userName: users.name,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .where(eq(feedFollows.userId, userId));
}

export async function getFeedByUrl(url: string) {
  const [feed] = await db
    .select()
    .from(feeds)
    .where(eq(feeds.url, url));

  return feed ?? null;
}
