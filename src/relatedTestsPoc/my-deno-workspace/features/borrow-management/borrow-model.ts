/**
 * borrow-model.ts
 * Defines the Borrow model for the Library Management System.
 */
export interface Borrow {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: Date;
  returnDate?: Date;
}
