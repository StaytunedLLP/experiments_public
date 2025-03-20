// File: my-deno-workspace/features/category-management/category-service.test.ts
import { addCategory, listCategories } from "@workspace/category-management";
import { assert, assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

describe("Category Management Tests", () => {
  describe("addCategory", () => {
    it("should add a new category and return it", async () => {
      const category = await addCategory("Fiction");
      assert(category.id, "addCategory should return a category with an id");
      assertEquals(
        category.name,
        "Fiction",
        "addCategory should set the correct name",
      );
    });
  });
});
