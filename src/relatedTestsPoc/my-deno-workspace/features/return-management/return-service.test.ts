// File: my-deno-workspace/features/return-management/return-service.test.ts
import { listReturns, returnBook } from "@workspace/return-management";
import { borrowBook, listBorrows } from "@workspace/borrow-management";
import { addBook } from "@workspace/book-management";
import { addUser } from "@workspace/user-management";
import { assert, assertEquals, assertExists } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

describe("Return Management Tests", () => {
  describe("returnBook", () => {
    it("should set returnDate for a borrow record", async () => {
      const book = await addBook("Return Test Book", "Return Test Author");
      const user = await addUser("Return Test User");
      const borrowRecord = await borrowBook(book.id, user.id);
      assertExists(
        borrowRecord,
        "Borrow record should be created for return test",
      );

      const returnedBorrowRecord = await returnBook(borrowRecord!.id);
      assertExists(
        returnedBorrowRecord,
        "returnBook should return the updated borrow record",
      );
      assert(
        returnedBorrowRecord!.returnDate instanceof Date,
        "returnBook should set a returnDate",
      );

      const listedBorrows = listBorrows(); // Refresh borrows list to reflect changes
      assertEquals(
        listedBorrows[0].returnDate,
        returnedBorrowRecord!.returnDate,
        "Original borrow record should also be updated with returnDate",
      );
    });

    it("should fail if borrow record does not exist", async () => {
      const nonExistingBorrowId = "non-existing-borrow-id";
      const returnRecord = await returnBook(nonExistingBorrowId);
      assertEquals(
        returnRecord,
        null,
        "returnBook should return null if borrow record does not exist",
      );
    });
  });

  describe("listReturns", () => {
    it("should list all return records", async () => {
      const book = await addBook(
        "Return List Test Book",
        "Return List Test Author",
      );
      const user = await addUser("Return List Test User");
      const borrowRecord = await borrowBook(book.id, user.id);
      await returnBook(borrowRecord!.id); // Return the book to create a return record

      const returns = listReturns();
      assertEquals(
        returns.length,
        2,
        "listReturns should return all return records",
      );
      assertEquals(
        returns[1].borrowId,
        borrowRecord!.id,
        "listReturns should contain the returned borrow record id",
      );
      assert(
        returns[0].returnDate instanceof Date,
        "listReturns should have a returnDate in return record",
      );
    });
  });
});
