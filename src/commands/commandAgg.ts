import { scrapeFeeds } from "src/aggregator";
import type { CommandHandler } from "./types";

function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error("Invalid duration format. Use: 30s, 5m, 1h, etc.");
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "ms": return value;
    case "s": return value * 1000;
    case "m": return value * 60 * 1000;
    case "h": return value * 60 * 60 * 1000;
    default: throw new Error("Invalid time unit");
  }
}

export const commandAgg: CommandHandler = async (_cmdName: string, durationStr: string) => {
  if (!durationStr) {
    throw new Error("Usage: agg <duration>\nExample: agg 60s  or  agg 5m");
  }

  const timeBetweenRequests = parseDuration(durationStr);

  console.log(`Collecting feeds every ${durationStr}...`);
  console.log("Press Ctrl+C to stop.\n");

  // run once immediately
  await scrapeFeeds().catch((err) => console.error("Error in scrapeFeeds:", err.message));

  // set up interval
  const interval = setInterval(() => {
    scrapeFeeds().catch((err) => console.error("Error in scrapeFeeds:", err.message));
  }, timeBetweenRequests);

  // graceful shutdown on Ctrl+C
  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("\n🤖 Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
};
