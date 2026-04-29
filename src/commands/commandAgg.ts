import { fetchFeed } from "../rss/feed";
import type { CommandHandler } from "./types";

export const commandAgg: CommandHandler = async (_cmdName: string, ..._args: string[]) => {
  const feedUrl = "https://www.wagslane.dev/index.xml";

  console.log(`Fetching feed from: ${feedUrl}`);

  try {
    const feed = await fetchFeed(feedUrl);

    console.log("\nFeed fetched successfully!");
    // pretty print the whole object
    console.dir(feed, { depth: null });
  } catch (error: any) {
    console.error("Failed to fetch feed:");
    console.error(error.message);
    throw error;
  }
};
