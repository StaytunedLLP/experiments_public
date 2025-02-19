/**
 * user-service.ts
 * Provides functionalities to manage users in the library.
 */
import { User } from "@workspace/user-management";
import { NAMESPACE_DNS, v5 } from "@std/uuid";
import { log } from "@workspace/utilities";

let users: User[] = [];

/**
 * Adds a new user.
 */
export async function addUser(name: string): Promise<User> {
  const newUser: User = {
    id: await v5.generate(NAMESPACE_DNS, new TextEncoder().encode(name)),
    name,
  };
  users.push(newUser);
  return newUser;
}

/**
 * Lists all users.
 */
export function listUsers(): User[] {
  log("Listing all users");
  return users;
}
