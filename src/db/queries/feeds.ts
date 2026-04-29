import { db } from "..";
import { feeds } from "../schema";

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
