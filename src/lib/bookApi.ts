import { apiGet, apiPost, apiPut } from './api';
import type { BookData } from '../App';

export interface UserBook {
  id: string;
  clientBookId?: string;
  templateId?: string;
  title: string;
  status: string;
  createdAt?: string;
  updatedAt: string;
  bookData?: string;
}

export interface UserBookPage {
  id: string;
  userBookId: string;
  templatePageId: string;
  pageNumber: number;
  userContent: any;
}

export const bookApi = {
  getMyBooks: (userId: string) => apiGet<UserBook[]>('/api/books/my', { headers: { 'X-User-Id': userId } }),
  createBook: (userId: string, data: { clientBookId?: string; templateId: string; title: string }) =>
    apiPost<UserBook>('/api/books', data, { headers: { 'X-User-Id': userId } }),
  saveSnapshot: (userId: string, book: BookData) =>
    apiPut<UserBook>(
      `/api/books/client/${encodeURIComponent(book.id)}`,
      {
        clientBookId: book.id,
        templateId: book.templateId,
        title: book.title || 'Sách mới',
        status: book.status || 'draft',
        bookData: JSON.stringify(book),
      },
      { headers: { 'X-User-Id': userId } }
    ),
  updatePage: (userId: string, bookId: string, pageId: string, content: any) => 
    apiPut<void>(`/api/books/${bookId}/pages/${pageId}`, { userContent: content }, { headers: { 'X-User-Id': userId } }),
};
