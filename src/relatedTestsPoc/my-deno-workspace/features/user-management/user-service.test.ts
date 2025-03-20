// File: my-deno-workspace/features/user-management/user-service.test.ts
import { addUser, listUsers } from "@workspace/user-management";
import { assert, assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

describe("User Management Tests", () => {
  describe("addUser", () => {
    it("should add a new user and return it", async () => {
      const user = await addUser("Alice");
      assert(user.id, "addUser should return a user with an id");
      assertEquals(user.name, "Alice", "addUser should set the correct name");
    });
  });

  describe("listUsers", () => {
    it("should list all users", async () => {
      await addUser("Alice"); // Ensure at least one user exists
      await addUser("Bob");
      const users = await listUsers();
      assertEquals(users.length, 3, "listUsers should return all users");
      assertEquals(
        users[1].name,
        "Alice",
        "listUsers should contain the first user",
      );
      assertEquals(
        users[2].name,
        "Bob",
        "listUsers should contain the second user",
      );
    });
  });
});
