import { asc, eq, sql } from "drizzle-orm";
import { db } from "..";
import { Feed, feeds, users } from "../schema";

export async function createFeed(name: string, url: string, userId: string) {
  const [newFeed] = await db
    .insert(feeds)
    .values({
      name: name.trim(),
      url: url.trim(),
      userId,
    })
    .returning();

  return newFeed;
}

export async function markFeedFetched(feedId: string) {
  await db
    .update(feeds)
    .set({
      lastFetchedAt: sql`NOW()`,
      updatedAt: sql`NOW()`,
    })
    .where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch(): Promise<Feed | null> {
  const [feed] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} NULLS FIRST`, asc(feeds.lastFetchedAt))
    .limit(1);

  return feed ?? null;
}

export async function getFeeds() {
  return await db
    .select({
      feedId: feeds.id,
      feedName: feeds.name,
      feedUrl: feeds.url,
      userId: users.id,
      userName: users.name,
    }
    ).from(feeds).leftJoin(users, eq(feeds.userId, users.id));
}
