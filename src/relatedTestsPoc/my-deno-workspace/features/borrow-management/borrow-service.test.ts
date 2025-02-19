// File: my-deno-workspace/features/borrow-management/borrow-service.test.ts
import { borrowBook, listBorrows } from "@workspace/borrow-management";
import { addBook } from "@workspace/book-management";
import { addUser } from "@workspace/user-management";
import { assert, assertEquals, assertExists } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

describe("Borrow Management Tests", () => {
  describe("borrowBook", () => {
    it("should create a borrow record if book and user exist", async () => {
      const book = await addBook("Borrow Test Book", "Borrow Test Author");
      const user = await addUser("Borrow Test User");

      assertExists(book, "Book should be created for borrow test");
      assertExists(user, "User should be created for borrow test");

      const borrowRecord = await borrowBook(book.id, user.id);
      assertExists(borrowRecord, "borrowBook should return a borrow record");
      assert(borrowRecord!.id, "borrowRecord should have an id");
      assertEquals(
        borrowRecord!.bookId,
        book.id,
        "borrowRecord should have the correct bookId",
      );
      assertEquals(
        borrowRecord!.userId,
        user.id,
        "borrowRecord should have the correct userId",
      );
      assert(
        borrowRecord!.borrowDate instanceof Date,
        "borrowRecord should have a borrowDate",
      );
      assertEquals(
        borrowRecord!.returnDate,
        undefined,
        "borrowRecord should not have a returnDate initially",
      );
    });

    it("should fail if book does not exist", async () => {
      const nonExistingBookId = "non-existing-book-id";
      const borrowRecordNoBook = await borrowBook(
        nonExistingBookId,
        "some-user-id",
      );
      assertEquals(
        borrowRecordNoBook,
        null,
        "borrowBook should return null if book does not exist",
      );
    });

    it("should fail if user does not exist", async () => {
      const nonExistingUserId = "non-existing-user-id";
      const borrowRecordNoUser = await borrowBook(
        "some-book-id",
        nonExistingUserId,
      );
      assertEquals(
        borrowRecordNoUser,
        null,
        "borrowBook should return null if user does not exist",
      );
    });
  });

  describe("listBorrows", () => {
    it("should list all borrow records", async () => {
      const book = await addBook(
        "Borrow List Test Book",
        "Borrow List Test Author",
      );
      const user = await addUser("Borrow List Test User");
      const borrowRecord = await borrowBook(book.id, user.id);

      const borrows = listBorrows();
      assertEquals(
        borrows.length,
        2,
        "listBorrows should return all borrow records",
      );
      assertEquals(
        borrows[1].id,
        borrowRecord!.id,
        "listBorrows should contain the created borrow record",
      );
    });
  });
});
