/**
 * return-service.ts
 * Manages the returning of books.
 */
import { Borrow, listBorrows } from "@workspace/borrow-management";
import { Return } from "@workspace/return-management";
import { log } from "@workspace/utilities";

let returns: Return[] = [];

/**
 * Return a borrowed book.
 */
export async function returnBook(borrowId: string): Promise<Borrow | null> {
  const borrowRecord = listBorrows().find((b) => b.id === borrowId);
  if (!borrowRecord) {
    return null;
  }
  borrowRecord.returnDate = new Date();
  return borrowRecord;
}

/**
 * Lists all return records (implicitly through borrow records with returnDate).
 */
export function listReturns(): Return[] {
  log("Listing all returns");
  return listBorrows().filter((borrow) => borrow.returnDate).map((borrow) => ({
    id: borrow.id, // Reusing borrowId as returnId for simplicity in this demo
    borrowId: borrow.id,
    returnDate: borrow.returnDate!,
  }));
}
