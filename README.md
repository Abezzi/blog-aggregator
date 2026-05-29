# Blog Aggregator - Gator CLI

Gator is a lightweight, multi-user RSS feed aggregator CLI built with TypeScript, PostgreSQL, and Drizzle ORM.
It allows users to follow RSS feeds, automatically fetch new posts in the background, and browse the latest content directly in the terminal, just like early 2000s desktop feed readers.
Gator is designed for local use with a simple JSON config file and a PostgreSQL database. Perfect for developers who want to stay updated with tech blogs, news, and personal sites without relying on bloated web services.

## Features

- **User Management**: Register and switch between multiple users
- **Feed Management**: Add RSS feeds and follow/unfollow them
- **Background Aggregation**: Long-running aggregator that automatically fetches new posts
- **Smart Fetching**: Only fetches feeds that haven't been recently updated (using last_fetched_at)
- **Post Storage**: Saves posts to the database with deduplication (unique URLs)
- **Browse Posts**: View latest posts from feeds you follow, with clean terminal output
- **Middleware System**: Clean, reusable authentication for protected commands
- **Graceful Shutdown**: Ctrl+C safely stops the aggregator
- **Robust Error Handling:** Handles duplicate posts, invalid feeds, and network issues

## Available Commands

| Command                | Description                                    | Usage                                               |
| ---------------------- | ---------------------------------------------- | --------------------------------------------------- |
| `addfeed <name> <url>` | Add a new RSS feed and follow it               | `addfeed "TechCrunch" https://techcrunch.com/feed/` |
| `agg <interval>`       | Start the background aggregator (e.g. 60s, 5m) | `agg 60s`                                           |
| `browse [limit]`       | Browse latest posts from feeds you follow      | `browse 10`                                         |
| `feeds`                | List all feeds in the system.                  | `feeds`                                             |
| `follow <url>`         | Follow an existing feed                        | `follow https://news.ycombinator.com/rss`           |
| `following`            | List all feeds you're currently following.     | `following`                                         |
| `login <name>`         | Switchs to an existing user.                   | `login sofia`                                       |
| `register <name>`      | Creates a new user and switch to it            | `register alex`                                     |
| `reset`                | Delete all users and their data (dangerous)    | `reset`                                             |
| `unfollow <url>`       | Unfollow an existing feed                      | `unfollow https://techcrunch.com/feed/`             |
| `users`                | List all the users and the one logged in       | `users`                                             |

## Example Usage

```bash
# 1. register and login
npm run start register alex

# 2. Add some feeds
npm run start addfeed "Boot.dev" "https://www.boot.dev/blog/index.xml"
npm run start addfeed "Hacker News" "https://news.ycombinator.com/rss"

# 3. Start the aggregator in one terminal
npm run start agg 60s

# 4. In another terminal, browse posts
npm run start browse 10
```

## installation

1. Install postgres

macOS:

```bash
brew install postgresql@16
```

Arch Linux:

```bash
sudo pacman -S postgresql
```

2. initialize Postgresql

macOS:

```bash
brew services start postgresql@16
```

Arch Linux:

```bash
sudo -u postgres initdb -D /var/lib/postgres/data --locale en_US.UTF-8
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo -u postgres psql
```

3. Enter psql shell

macOS:

```bash
psql postgres
```

Arch Linux:

```bash
sudo -u postgres psql
```

4. Create the gator database

```sql
CREATE DATABASE gator;
```

5. Connect to the database and set the user password

```bash
\c gator
ALTER USER postgres PASSWORD 'postgres';
```

6. Create a .gatorconfig.json at the home directory (vim ~/.gatorconfig.json) from this file the gator cli will read the database, instead of a .env file

```json
{
  "db_url": "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable",
  "current_user_name": "yourname"
}
```

## Generate schema and apply the migration

```bash
npm run generate
npm run migrate
```
