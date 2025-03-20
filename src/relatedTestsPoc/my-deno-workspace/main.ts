/**
 * main.ts
 * Entry point for the Library Management System demo.
 */
import { log } from "@workspace/utilities";
import { addBook, listBooks } from "@workspace/book-management";
import { addUser, listUsers } from "@workspace/user-management";
import { borrowBook } from "@workspace/borrow-management";

// Demo: Add two books
const book1 = await addBook("The Great Gatsby", "F. Scott Fitzgerald");
const book2 = await addBook("1984", "George Orwell");
log(`Added books: ${JSON.stringify(await listBooks(), null, 2)}`);

// Demo: Add two users
const user1 = await addUser("Alice");
const user2 = await addUser("Bob");
log(`Added users: ${JSON.stringify(await listUsers(), null, 2)}`);

// Demo: Borrow a book
const borrowRecord = await borrowBook(book1.id, user1.id);
if (borrowRecord) {
  log(`Borrow record created: ${JSON.stringify(borrowRecord, null, 2)}`);
} else {
  log("Failed to create borrow record.");
}
