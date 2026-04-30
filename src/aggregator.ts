import { fetchFeed } from "./rss/feed";
import { getNextFeedToFetch, markFeedFetched } from "./db/queries/feeds";
import { createPost } from "./db/queries/posts";

export async function scrapeFeeds() {
  console.log("\n🤖🔎 Looking for next feed to scrape...");

  const feed = await getNextFeedToFetch();

  if (!feed) {
    console.log("🤖🕳️ No feeds found in database.");
    return;
  }

  console.log(`🤖🧲 Fetching: ${feed.name} (${feed.url})`);

  try {
    await markFeedFetched(feed.id);

    const rssFeed = await fetchFeed(feed.url);

    let savedCount = 0;

    for (const item of rssFeed.items) {
      try {
        let publishedAt: Date | undefined = undefined;
        if (item.pubDate) {
          const date = new Date(item.pubDate);
          if (!isNaN(date.getTime())) {
            publishedAt = date;
          }
        }

        await createPost({
          title: item.title,
          url: item.link,
          description: item.description || undefined,
          publishedAt,
          feedId: feed.id,
        });

        savedCount++;
        console.log(`   Saved: ${item.title}`);
      } catch (err: any) {
        // Ignore duplicate URL errors (unique constraint)
        if (!err.message?.includes("unique")) {
          console.error(`   Failed to save post: ${item.title}`);
        }
      }
    }

    console.log(`🤖✅ Saved ${savedCount} new posts from ${feed.name}"`);

  } catch (error: any) {
    console.error(`🤖⛔ Error fetching ${feed.name}:`, error.message);
  }
}
