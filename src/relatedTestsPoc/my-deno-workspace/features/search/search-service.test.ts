// File: my-deno-workspace/features/search/search-service.test.ts
import { searchBooks } from "@workspace/search";
import { addBook, listBooks } from "@workspace/book-management";
import { assertEquals } from "@std/assert";
import { beforeEach, describe, it } from "@std/testing/bdd";

describe("Search Tests", () => {
  beforeEach(async () => {
    // Clear books before each test to ensure isolation
    // This is a simplified approach, consider a more robust reset if needed for your actual data persistence
    const currentBooks = await listBooks();
    currentBooks.length = 0; // Clear the array in place
  });

  describe("searchBooks", () => {
    it("should search books by title", async () => {
      await addBook("The Lord of the Rings", "J.R.R. Tolkien");
      await addBook("The Hobbit", "J.R.R. Tolkien");
      await addBook("Pride and Prejudice", "Jane Austen");

      const results1 = await searchBooks("Lord");
      assertEquals(
        results1.length,
        1,
        "Should find one book with 'Lord' in title",
      );
      assertEquals(
        results1[0].title,
        "The Lord of the Rings",
        "Should find 'The Lord of the Rings'",
      );

      const results2 = await searchBooks("rings");
      assertEquals(
        results2.length,
        1,
        "Should find one book with 'rings' (case-insensitive) in title",
      );
      assertEquals(
        results2[0].title,
        "The Lord of the Rings",
        "Should find 'The Lord of the Rings'",
      );

      const results3 = await searchBooks("NonExistingTitle");
      assertEquals(
        results3.length,
        0,
        "Should find no books for non-existing title",
      );
    });

    it("should search books by author", async () => {
      await addBook("The Lord of the Rings", "J.R.R. Tolkien");
      await addBook("The Hobbit", "J.R.R. Tolkien");
      await addBook("Pride and Prejudice", "Jane Austen");

      const results1 = await searchBooks("Tolkien");
      assertEquals(results1.length, 2, "Should find two books by Tolkien");
      assertEquals(
        results1[0].author,
        "J.R.R. Tolkien",
        "Should find books by J.R.R. Tolkien",
      );
      assertEquals(
        results1[1].author,
        "J.R.R. Tolkien",
        "Should find books by J.R.R. Tolkien",
      );

      const results2 = await searchBooks("austen");
      assertEquals(
        results2.length,
        1,
        "Should find one book by Austen (case-insensitive)",
      );
      assertEquals(
        results2[0].author,
        "Jane Austen",
        "Should find 'Pride and Prejudice'",
      );

      const results3 = await searchBooks("NonExistingAuthor");
      assertEquals(
        results3.length,
        0,
        "Should find no books for non-existing author",
      );
    });

    it("should search books by title or author (OR logic)", async () => {
      await addBook("The Lord of the Rings", "J.R.R. Tolkien");
      await addBook("Pride and Prejudice", "Jane Austen");

      const results = await searchBooks("prejudice");
      assertEquals(
        results.length,
        1,
        "Should find 'Pride and Prejudice' by title search",
      );

      const results2 = await searchBooks("tolkien");
      assertEquals(
        results2.length,
        1,
        "Should find 'The Lord of the Rings' by author search",
      );
    });
  });
});
