/**
 * category-service.ts
 * Provides functionalities to manage book categories.
 */
import { Category } from "@workspace/category-management";
import { NAMESPACE_DNS, v5 } from "@std/uuid";
import { log } from "@workspace/utilities";

let categories: Category[] = [];

/**
 * Adds a new category.
 */
export async function addCategory(name: string): Promise<Category> {
  const newCategory: Category = {
    id: await v5.generate(NAMESPACE_DNS, new TextEncoder().encode(name)),
    name,
  };
  categories.push(newCategory);
  return newCategory;
}

/**
 * Lists all categories.
 */
export function listCategories(): Category[] {
  log("Listing all categories");
  return categories;
}
