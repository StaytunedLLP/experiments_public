/**
 * search-service.ts
 * Provides functionalities to search books.
 */
import { Book, listBooks } from "@workspace/book-management";
import { log } from "@workspace/utilities";

/**
 * Searches books by title or author.
 */
export async function searchBooks(query: string): Promise<Book[]> {
  log(`Searching for books with query: ${query}`);
  const allBooks = await listBooks();
  const lowerQuery = query.toLowerCase();
  return allBooks.filter((book) =>
    book.title.toLowerCase().includes(lowerQuery) ||
    book.author.toLowerCase().includes(lowerQuery)
  );
}
