import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";

const config = readConfig();

export default defineConfig({
  out: "./drizzle",
  schema: "src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: config.dbUrl,
  },
});
