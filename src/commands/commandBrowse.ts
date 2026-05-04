import type { UserCommandHandler } from "./types";
import { getPostsForUser } from "../db/queries/posts";
import { User } from "src/db/schema";

type BrowseOptions = {
  limit?: number;
  sort?: "newest" | "oldest";
  feed?: string;
  search?: string;
};

export const commandBrowse: UserCommandHandler = async (
  _cmdName: string,
  user: User,
  ...rawArgs: string[]
) => {
  const options = {
    limit: 10,
    sort: "newest" as "newest" | "oldest",
    search: "",
    feed: "",
  };

  let i = 0;
  while (i < rawArgs.length) {
    const arg = rawArgs[i];

    if (arg === "--oldest" || arg === "-o") {
      options.sort = "oldest";
    }
    else if (arg.startsWith("--limit=") || arg === "-n") {
      const value = arg.startsWith("--limit=")
        ? arg.split("=")[1]
        : rawArgs[i + 1];
      options.limit = parseInt(value) || 10;
      if (!arg.startsWith("--limit=")) i++;
    }
    else if (arg.startsWith("--search=") || arg === "-s") {
      const value = arg.startsWith("--search=")
        ? arg.split("=")[1]
        : rawArgs[i + 1];
      options.search = value?.trim() || "";
      if (!arg.startsWith("--search=")) i++;
    }
    else if (arg.startsWith("--feed=")) {
      options.feed = arg.split("=")[1]?.trim() || "";
    }
    else if (!isNaN(parseInt(arg)) && parseInt(arg) > 0) {
      options.limit = parseInt(arg);
    }
    else if (arg && !arg.startsWith("-")) {
      // search term default argument
      options.search = arg;
    }

    i++;
  }

  // console.log("Parsed options:", options);

  let posts = await getPostsForUser(user.id, options.limit);

  // search
  if (options.search) {
    const term = options.search.toLowerCase();
    posts = posts.filter(p =>
      p.title.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term)) ||
      p.feedName.toLowerCase().includes(term)
    );
  }

  if (options.feed) {
    const term = options.feed.toLowerCase();
    posts = posts.filter(p => p.feedName.toLowerCase().includes(term));
  }

  if (posts.length === 0) {
    console.log("No matching posts found.");
    return;
  }

  const sortText = options.sort === "newest" ? "Newest first" : "Oldest first";
  console.log(`📖 Posts for ${user.name} (${posts.length} shown) • ${sortText}\n`);

  if (options.sort === "oldest") {
    posts = [...posts].sort((a, b) => (a.publishedAt?.getTime() || 0) - (b.publishedAt?.getTime() || 0));
  }

  posts.forEach((post, i) => {
    console.log(`${i + 1}. ${post.title}`);
    console.log(`   Feed : ${post.feedName}`);
    if (post.publishedAt) console.log(`   Published: ${post.publishedAt.toISOString().split('T')[0]}`);
    console.log(`   URL  : ${post.url}`);
    console.log("");
  });
};
