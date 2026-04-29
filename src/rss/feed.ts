import { XMLParser } from "fast-xml-parser";
import type { RSSFeed, RSSItem } from "../types/feed";

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
  // fetch the feed with user-agent
  const response = await fetch(feedURL, {
    headers: {
      "User-Agent": "gator",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
  }

  const xmlText = await response.text();

  // parse XML
  const parser = new XMLParser({
    processEntities: false,
    ignoreAttributes: false,
  });

  const parsed = parser.parse(xmlText);

  // extract channel
  const channel = parsed.rss?.channel || parsed.feed?.channel || parsed.channel;

  if (!channel) {
    throw new Error("Invalid RSS feed: missing <channel> element");
  }

  // extract metadata
  const title = channel.title;
  const link = channel.link;
  const description = channel.description;

  if (!title || !link || !description) {
    throw new Error("Invalid RSS feed: missing required channel fields (title, link, or description)");
  }

  // extract items
  let items: RSSItem[] = [];

  const rawItems = channel.item;

  if (rawItems) {
    const itemArray = Array.isArray(rawItems) ? rawItems : [rawItems];

    items = itemArray
      .map((item: any): RSSItem | null => {
        const itemTitle = item.title;
        const itemLink = item.link;
        const itemDesc = item.description;
        const pubDate = item.pubDate;

        // skip items missing critical fields
        if (!itemTitle || !itemLink) {
          return null;
        }

        return {
          title: itemTitle,
          link: itemLink,
          description: itemDesc || "",
          pubDate: pubDate || undefined,
        };
      })
      .filter((item): item is RSSItem => item !== null);
  }

  // return the final RSSFeed object
  return {
    title,
    link,
    description,
    items,
  };
}
