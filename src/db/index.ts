import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";
import { readConfig } from "../config";

// create the database connection and drizzle instance
const config = readConfig();
const connection = postgres(config.dbUrl);

export const db = drizzle(connection, { schema });

// in case I need the connection in the future
export const sql = connection;
