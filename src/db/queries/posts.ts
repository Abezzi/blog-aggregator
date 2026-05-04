import { db } from "..";
import { posts, feeds, feedFollows } from "../schema";
import { eq, desc } from "drizzle-orm";

export type PostWithFeed = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  publishedAt: Date | null;
  feedId: string;
  feedName: string;
  createdAt: Date | null;
};

export async function createPost(postData: {
  title: string;
  url: string;
  description?: string;
  publishedAt?: Date;
  feedId: string;
}) {
  const [newPost] = await db
    .insert(posts)
    .values({
      title: postData.title,
      url: postData.url,
      description: postData.description,
      publishedAt: postData.publishedAt,
      feedId: postData.feedId,
    })
    .returning();

  return newPost;
}

export async function getPostsForUser(userId: string, limit: number = 10): Promise<PostWithFeed[]> {
  return await db
    .select({
      id: posts.id,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
      feedName: feeds.name,
      createdAt: feeds.createdAt
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feedFollows, eq(feeds.id, feedFollows.feedId))
    .where(eq(feedFollows.userId, userId))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
    .limit(limit);
}
