/**
 * book-service.ts
 * Provides functionalities to manage books in the library.
 */
import { Book } from "@workspace/book-management";
import { NAMESPACE_DNS, v5 } from "@std/uuid";
import { log } from "@workspace/utilities";

let books: Book[] = [];

/**
 * Adds a new book to the system.
 */
export async function addBook(title: string, author: string): Promise<Book> {
  const newBook: Book = {
    id: await v5.generate(
      NAMESPACE_DNS,
      new TextEncoder().encode(`${title}-${author}`),
    ),
    title,
    author,
  };
  books.push(newBook);
  return newBook;
}

/**
 * Lists all books in the system.
 */
export function listBooks(): Book[] {
  log("Listing all books");
  return books;
}
