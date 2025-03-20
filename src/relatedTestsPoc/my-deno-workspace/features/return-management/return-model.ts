/**
 * return-model.ts
 * Defines the Return model for the Library Management System.
 */
export interface Return {
  id: string;
  borrowId: string;
  returnDate: Date;
}
