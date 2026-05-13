import { apiGet } from './api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export const categoryApi = {
  getCategories: () => apiGet<Category[]>('/api/public/categories'),
};