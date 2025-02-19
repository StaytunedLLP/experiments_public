/**
 * borrow-service.ts
 * Manages the borrowing and returning of books.
 */
import { Borrow } from "@workspace/borrow-management";
import { listBooks } from "@workspace/book-management";
import { listUsers } from "@workspace/user-management";
import { NAMESPACE_DNS, v5 } from "@std/uuid";
import { log } from "@workspace/utilities";

let borrows: Borrow[] = [];

/**
 * Borrow a book by a user.
 */
export async function borrowBook(
  bookId: string,
  userId: string,
): Promise<Borrow | null> {
  // Check if the book exists
  const book = listBooks().find((b) => b.id === bookId);
  if (!book) {
    return null;
  }
  // Check if the user exists
  const user = listUsers().find((u) => u.id === userId);
  if (!user) {
    return null;
  }
  const newBorrow: Borrow = {
    id: await v5.generate(
      NAMESPACE_DNS,
      new TextEncoder().encode(`${bookId}-${userId}`),
    ),
    bookId,
    userId,
    borrowDate: new Date(),
  };
  borrows.push(newBorrow);
  return newBorrow;
}

/**
 * Lists all borrow records.
 */
export function listBorrows(): Borrow[] {
  log("Listing all borrows");
  return borrows;
}
