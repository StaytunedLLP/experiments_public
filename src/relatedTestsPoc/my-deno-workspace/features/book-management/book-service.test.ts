// File: my-deno-workspace/features/book-management/book-service.test.ts
import { addBook, listBooks } from "@workspace/book-management";
import { assert, assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
describe("Book Management Tests", () => {
  describe("addBook", () => {
    it("should add a new book and return it", async () => {
      const book = await addBook("Test Book 1", "Test Author 1");
      assert(book.id, "addBook should return a book with an id");
      assertEquals(
        book.title,
        "Test Book 1",
        "addBook should set the correct title",
      );
      assertEquals(
        book.author,
        "Test Author 1",
        "addBook should set the correct author",
      );
    });
  });

  describe("listBooks", () => {
    it("should list all books", async () => {
      await addBook("Test Book 1", "Test Author 1"); // Ensure at least one book exists
      await addBook("Test Book 2", "Test Author 2");
      const books = await listBooks();
      assertEquals(books.length, 3, "listBooks should return all books");
      assertEquals(
        books[1].title,
        "Test Book 1",
        "listBooks should contain the first book",
      );
      assertEquals(
        books[2].title,
        "Test Book 2",
        "listBooks should contain the second book",
      );
    });
  });
});
