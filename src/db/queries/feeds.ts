import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schema";

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
