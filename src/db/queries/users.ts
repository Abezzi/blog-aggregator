import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUserByName(name: string) {
  return await db.query.users.findFirst({
    where: eq(users.name, name),
  })
}

export async function deleteUsers() {
  return await db.delete(users);
}

export async function getUsers() {
  return await db.select().from(users);
}
