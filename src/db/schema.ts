import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const feeds = pgTable("feeds", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastFetchedAt: timestamp("last_fetched_at"),
});

export const feedFollows = pgTable(
  "feed_follows",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    feedId: uuid("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.userId, table.feedId).nullsNotDistinct(),
  ]
);

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull().unique(),
  description: text("description"),
  publishedAt: timestamp("published_at"),
  feedId: uuid("feed_id")
    .notNull()
    .references(() => feeds.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


// relations
export const usersRelations = relations(users, ({ many }) => ({
  feedFollows: many(feedFollows),
}));

export const feedsRelations = relations(feeds, ({ many }) => ({
  feedFollows: many(feedFollows),
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  feed: one(feeds, {
    fields: [posts.feedId],
    references: [feeds.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Feed = typeof feeds.$inferSelect;
export type NewFeed = typeof feeds.$inferInsert;

export type Post = typeof feeds.$inferSelect;
export type NewPost = typeof feeds.$inferInsert;
