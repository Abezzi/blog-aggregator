import type { CommandHandler } from "./types";
import { getFeeds } from "src/db/queries/feeds";

type FeedWithUser = {
  feedId: string;
  feedName: string;
  feedUrl: string;
  userId: string | null;
  userName: string | null;
}

function printFeed(feeds: FeedWithUser[]) {
  console.log(`📋 List of feeds:`);
  console.log(`----------------------------------------------------`);
  for (let feed of feeds) {
    console.log(`Feed Name: ${feed.feedName}`);
    console.log(`User Name: ${feed.userName}`);
    console.log(`      URL: ${feed.feedUrl}`);
    console.log(`       ID: ${feed.feedId}`);
    console.log(`----------------------------------------------------`);
  }
}

export const commandFeeds: CommandHandler = async (_cmdName: string, ..._args: string[]) => {
  try {
    const feeds = await getFeeds();
    printFeed(feeds);

  } catch (err) {
    throw new Error("Couldn't list the feed");
  }
};
