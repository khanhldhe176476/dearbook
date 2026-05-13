import { apiGet } from "./api";

export type BookCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

export function getCategories() {
  return apiGet<BookCategory[]>("/api/public/categories");
}